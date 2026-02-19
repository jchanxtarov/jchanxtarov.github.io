#!/usr/bin/env python3
"""
Build js/data.js from CSV source files in data/ directory.

Usage:
    python scripts/build-data.py

CSV files read:
    data/publications.csv   - Publications (title, authors, venue, year, date, type, citations, paper_link)
    data/talks.csv          - Talks (year, yearJa, type, title, titleJa, desc, descJa, link, image)
    data/media.csv          - Media coverage (source, title, titleJa, url, date, category)
    data/awards_en.csv      - Awards in English (year, title, desc)
    data/awards_ja.csv      - Awards in Japanese (year, title, desc)
    data/news_en.csv        - News in English (date, text, isNew)
    data/news_ja.csv        - News in Japanese (date, text, isNew)

The script preserves all UI translation strings from a template embedded below.
Only data-driven sections (publications, talks, media, awards, news) are built from CSV.
"""

import csv
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")
OUTPUT = os.path.join(ROOT_DIR, "js", "data.js")


def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


def js_str(s):
    """Escape a string for JS output using double quotes."""
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{s}"'


def js_str_single(s):
    """Escape a string for JS output using single quotes."""
    if s is None:
        return "null"
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{s}'"


def build_publications(rows):
    lines = []
    current_year = None
    for row in rows:
        year = int(row["year"])
        if year != current_year:
            current_year = year
            if row["type"] == "preprint":
                lines.append(f"  // ── Preprints (arXiv) ──")
            else:
                lines.append(f"  // ── {year} ──")

        authors = row["authors"].split("|")
        authors_js = "[" + ",".join(js_str(a) for a in authors) + "]"

        parts = [
            f"title:{js_str(row['title'])}",
            f"authors:{authors_js}",
            f"venue:{js_str(row['venue'])}",
            f"year:{year}",
        ]
        if row.get("date"):
            parts.append(f"date:{js_str(row['date'])}")
        parts.append(f"type:{js_str(row['type'])}")
        parts.append(f"citations:{row['citations'] or 0}")

        link = row.get("paper_link", "").strip()
        if link:
            parts.append(f"links:{{paper:{js_str(link)}}}")
        else:
            parts.append("links:{}")

        lines.append("  { " + ", ".join(parts) + " },")

    return "const PUBLICATIONS = [\n" + "\n".join(lines) + "\n];"


def build_talks(rows):
    lines = []
    for row in rows:
        parts = [
            f"year:{js_str(row['year'])}",
            f"yearJa:{js_str(row['yearJa'])}",
            f"type:{js_str(row['type'])}",
            f"title:{js_str(row['title'])}",
            f"titleJa:{js_str(row['titleJa'])}",
            f"desc:{js_str(row['desc'])}",
            f"descJa:{js_str(row['descJa'])}",
        ]
        link = row.get("link", "").strip()
        parts.append(f"link:{js_str(link) if link else 'null'}")
        image = row.get("image", "").strip()
        parts.append(f"image:{js_str(image) if image else 'null'}")
        lines.append("  { " + ", ".join(parts) + " },")

    return "const TALKS = [\n" + "\n".join(lines) + "\n];"


def build_media(rows):
    lines = []
    for row in rows:
        parts = [
            f"source:{js_str(row['source'])}",
            f"title:{js_str(row['title'])}",
            f"titleJa:{js_str(row['titleJa'])}",
            f"url:{js_str(row['url'])}",
            f"date:{js_str(row['date'])}",
        ]
        cat = row.get("category", "").strip()
        if cat:
            parts.append(f"category:{js_str(cat)}")
        lines.append("  { " + ", ".join(parts) + " },")

    return "const MEDIA = [\n" + "\n".join(lines) + "\n];"


def build_awards(rows):
    items = []
    for row in rows:
        items.append(
            f'      {{year:{js_str(row["year"])},title:{js_str(row["title"])},desc:{js_str(row["desc"])}}}'
        )
    return ",\n".join(items)


def build_news(rows):
    items = []
    for row in rows:
        is_new = row["isNew"].strip().lower() in ("true", "1", "yes")
        text = row["text"].replace('"', '\\"')
        # Use single quotes for text to allow double-quoted HTML attributes
        items.append(
            f"      {{date:{js_str(row['date'])},text:'{row['text']}',isNew:{'true' if is_new else 'false'}}}"
        )
    return ",\n".join(items)


# ── UI Translation Template ──
# Only news.items and awards.items are generated from CSV.
# All other keys are maintained here.

TRANSLATIONS_EN_TEMPLATE = """  en: {{
    // Nav
    "nav.about":"About","nav.publications":"Publications","nav.talks":"Talks","nav.experience":"Experience","nav.education":"Education","nav.teaching":"Teaching","nav.awards":"Awards","nav.media":"Media","nav.service":"Service","nav.projects":"Projects",
    // Hero
    "hero.greeting":"Hello, I'm",
    "hero.affil1":"ZOZO Research (ZOZO, Inc.)",
    "hero.affil2":"Visiting Researcher, Waseda University",
    "hero.affil3":"Part-time Lecturer, Sophia University",
    "hero.stat.pubs":"Publications","hero.stat.cit":"Citations",
    // About
    "about.title":"About",
    "about.p1":"I am a machine learning researcher and engineer with a Ph.D. in Industrial Engineering and 8+ years of professional experience. I specialize in translating business objectives into practical AI solutions, with deep expertise in <strong>recommender systems</strong>, <strong>explainable AI</strong>, <strong>computer vision</strong>, and <strong>large language models</strong>. I am also passionate about education, serving as a Part-time Lecturer at Sophia University and a Visiting Research Fellow at Waseda University.",
    "about.p2":"As Director at <a href='https://research.zozo.com/' target='_blank'>ZOZO Research</a>, I lead the ML R&amp;D group, driving service development and industry-academia research collaboration. Blessed with wonderful team members and collaborators, I have published 50+ papers at top-tier conferences including WWW, ICLR, IJCAI, EMNLP, and CVPR, and my work has been featured in 100+ media outlets.",
    "about.interests":"Research Interests",
    // Publications
    "pub.title":"Publications","pub.subtitle":"Showing selected highlights only.","pub.showAll":"Show All Publications","pub.showLess":"Show Less","pub.scholarLink":"View on Google Scholar",
    "pub.filter.all":"All","pub.filter.conference":"Conference","pub.filter.journal":"Journal","pub.filter.workshop":"Workshop","pub.filter.preprint":"Preprint","pub.filter.domestic":"Domestic",
    "pub.sort":"Sort","pub.sort.year":"Newest","pub.sort.oldest":"Oldest",
    // News
    "news.title":"News",
    "news.items":[
{news_en}
    ],
    // Talks
    "talks.title":"Talks & Lectures",
    "talks.invited":"Invited Talk","talks.conference":"Conference","talks.workshop":"Workshop","talks.domestic":"Domestic",
    "talks.confTitle":"Conference Presentations","talks.confDesc":"Oral/poster presentations at top-tier international conferences worldwide.",
    "talks.wsDesc":"Workshop presentations at major computer vision and ML conferences.",
    "talks.domesticDesc":"Presentations at Japanese domestic conferences. Best Research Award at JSAI 2023.",
    // Experience
    "exp.title":"Professional Experience",
    "exp.zozo.dir":"Director, Deployment Department","exp.zozo.dir.d":"Leading the department responsible for deploying research outcomes into production systems at scale.",
    "exp.zozo.sm":"Senior Manager / Lead Research Scientist","exp.zozo.sm.d":"Led 10+ member ML research team. Published at top conferences (WWW, ICLR, IJCAI, EMNLP). Received LINE Yahoo! Best Employee Award (top 3 of 27,000+).",
    "exp.zozo.lead":"Lead Research Scientist","exp.zozo.lead.d":"Led research on fashion intelligence systems, recommender systems, and explainable AI. Won ZOZO Group Grand Prix (top 5 of 1,700+).",
    "exp.zozo.rs":"Research Scientist",
    "exp.ucsd":"UC San Diego","exp.ucsd.r":"Visiting Research Fellow, Computer Science Department","exp.ucsd.d":"Research at <a href='https://cseweb.ucsd.edu//~jmcauley/' target='_blank'>Julian McAuley Lab</a> on recommender systems and LLMs.",
    "exp.sophia":"Sophia University","exp.sophia.r":"Part-time Lecturer, Faculty of Science and Technology","exp.sophia.d":"Teaching courses on data science and machine learning. Student evaluation score: 4.8/5.0.",
    "exp.waseda.dsi":"Waseda University","exp.waseda.dsi.r":"Visiting Research Fellow, Data Science Institute","exp.waseda.dsi.d":"Research supervision and mentoring at <a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>Goto Lab</a>. 4 consecutive years of top graduate mentoring.",
    "exp.dena":"DeNA Co., Ltd.","exp.dena.r":"Software Developer","exp.dena.d":"Full-stack development with Ruby, Python, Go, and cloud infrastructure (AWS/GCP).",
    "exp.pksha":"PKSHA Technology","exp.pksha.r":"Machine Learning Engineering Intern","exp.pksha.d":"Machine learning engineering internship at a leading AI company.",
    "exp.azest":"AZEST Inc.","exp.azest.r":"Data Science Intern","exp.azest.d":"Data analytics and business intelligence using Tableau, Power BI, and other tools.",
    "exp.toreta":"Toreta Inc.","exp.toreta.r":"Software Development Intern","exp.toreta.d":"Full-stack software development at a restaurant tech startup.",
    // Education
    "edu.title":"Education",
    "edu.phd":"Ph.D. in Engineering (Industrial & Management Systems Engineering)","edu.phd.h":["Supported through ZOZO Working Professional Doctoral Program","Advisor: <a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>Prof. Masayuki Goto</a>","Research: Recommender systems, explainable AI, fashion intelligence"],
    "edu.ms":"Master of Engineering (Management Systems Engineering)","edu.ms.h":["Best Student Award (Top Graduate)","Advisor: <a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>Prof. Masayuki Goto</a>"],
    "edu.bs":"B.S. in Management Systems Engineering, School of Creative Science and Engineering",
    "edu.hs":"Senior High School",
    // Teaching
    "teaching.title":"Teaching",
    "teaching.sophia":"Sophia University — Part-time Lecturer","teaching.sophia.d":"Teaching courses on data science and machine learning at the Faculty of Science and Technology.",
    "teaching.sophia.score":"/ 5.0 Average Student Evaluation Score","teaching.sophia.note":"Consistently rated among top-evaluated lecturers across 3 years of teaching.",
    "teaching.waseda":"Waseda University — Visiting Research Fellow","teaching.waseda.d":"Research supervision and mentoring of undergraduate and graduate students.",
    "teaching.waseda.streak":"4 Years","teaching.waseda.label":"Consecutive Top Graduate Mentoring","teaching.waseda.note":"Students under my research supervision have graduated as top of their class for 4 consecutive years.",
    "teaching.studentMsg":"To all students I've had the pleasure of working with — whether through lectures, research mentoring, or <a href='https://ut-base.info/circles/122' target='_blank'>HAIT</a> mentoring — if you ever face challenges in your career or research, please don't hesitate to reach out. I'm always happy to support you, no matter how much time has passed. <strong>My door is always open.</strong>",
    // Awards
    "awards.title":"Awards & Honors",
    "awards.items":[
{awards_en}
    ],
    // Media
    "media.title":"Media Coverage","media.subtitle":"Research featured in 100+ media outlets. Selected highlights below.",
    "media.more":"And 100+ more media features including major tech outlets...",
    // Service
    "service.title":"Professional Service","service.reviewer":"Conference Reviewer / Program Committee","service.journal":"Journal Reviewer",
    // Projects
    "projects.title":"Non-Research Projects",
    "projects.tennis":"TaRO's CUP — Tennis Tournament & Community","projects.tennis.d":"Organizing tennis tournaments (TaRO's CUP, now in its 6th+ edition) and building a vibrant community for players of all levels. Partnering with sponsors like Paradiso and Bridgestone.",
    "projects.nepal":"Nepal Japan Project","projects.nepal.d":"International volunteer project between Nepal and Japan (2015, 2016). Served as Project Leader in 2016, coordinating cross-cultural exchanges and community development initiatives.",
    "projects.wedding":"Wedding Real-Time Quiz App","projects.wedding.d":"Developed a real-time quiz application for friends' weddings, supporting 100+ concurrent WebSocket connections. Used at 3 wedding events.",
    "projects.apps":"Personal Apps & Web Development","projects.apps.d":"Chat application, tennis tournament SNS, TaRO&Company website, and more. Full-stack development across Python, Ruby, Go, Kotlin, Swift, and modern web technologies.",
    // Collaboration
    "news.showAll":"Show All News","news.showLess":"Show Less",
    "talks.showAll":"Show All Talks & Presentations","talks.showLess":"Show Less",
    "awards.showAll":"Show All Awards","awards.showLess":"Show Less",
    "media.showAll":"Show All Media","media.showLess":"Show Less",
    "collab.title":"Let's Work Together","collab.subtitle":"I welcome speaking invitations, research collaborations, and event partnerships.",
    "collab.research":"Research Collaboration","collab.research.d":"I am actively seeking research collaborators in recommender systems, explainable AI, computer vision, and LLMs. Let's push the boundaries of AI research together.",
    "collab.speaking":"Speaking Invitations","collab.speaking.d":"I am actively accepting speaking invitations for conferences, workshops, seminars, and corporate events. Topics include AI/ML research, fashion tech, and industry-academia collaboration.",
    "collab.event":"Event & Conference Co-organizing","collab.event.d":"I am looking for partners to co-organize academic conferences, workshops, tech meetups, and industry events. Whether it's a new conference, a hackathon, or a cross-industry networking event — let's create something exciting together!",
    "collab.contact":"Feel free to reach out via email or LinkedIn. I look forward to hearing from you!",
    "collab.email":"Contact Me",
    // Footer
    "footer.visitors":"Visitor Map","footer.update":"Last updated: February 2026",
  }}"""

TRANSLATIONS_JA_TEMPLATE = """  ja: {{
    "nav.about":"概要","nav.publications":"論文","nav.talks":"講演","nav.experience":"職歴","nav.education":"学歴","nav.teaching":"教育","nav.awards":"受賞","nav.media":"メディア","nav.service":"学術活動","nav.projects":"プロジェクト",
    "hero.greeting":"はじめまして、",
    "hero.affil1":"ZOZO研究所（株式会社ZOZO）",
    "hero.affil2":"早稲田大学 客員研究員",
    "hero.affil3":"上智大学 非常勤講師",
    "hero.stat.pubs":"論文数","hero.stat.cit":"被引用数",
    "about.title":"概要",
    "about.p1":"ビジネス目標を実用的なAIソリューションに変換することを専門とし、<strong>推薦システム</strong>、<strong>説明可能なAI</strong>、<strong>コンピュータビジョン</strong>、<strong>大規模言語モデル</strong>に関する深い専門知識を持っています。また、教育にも強い情熱を持ち、上智大学の非常勤講師および早稲田大学の客員研究員として教育活動に携わっています。",
    "about.p2":"<a href='https://research.zozo.com/' target='_blank'>ZOZO研究所</a>のディレクターとして、ML R&amp;Dグループを率い、サービス開発や産学連携の研究を推進しています。素敵なメンバーや共同研究者に恵まれ、WWW、ICLR、IJCAI、EMNLP、CVPRなどのトップカンファレンスを含む50件以上の論文を発表し、100件以上のメディアに取り上げられています。",
    "about.interests":"研究分野",
    "pub.title":"論文一覧","pub.subtitle":"主要論文のみ掲載。","pub.showAll":"すべての論文を表示","pub.showLess":"折りたたむ","pub.scholarLink":"Google Scholarを見る",
    "pub.filter.all":"すべて","pub.filter.conference":"国際会議","pub.filter.journal":"ジャーナル","pub.filter.workshop":"ワークショップ","pub.filter.preprint":"プレプリント","pub.filter.domestic":"国内",
    "pub.sort":"並び順","pub.sort.year":"新しい順","pub.sort.oldest":"古い順",
    "news.title":"ニュース",
    "news.items":[
{news_ja}
    ],
    "talks.title":"講演等",
    "talks.invited":"招待講演","talks.conference":"学会発表","talks.workshop":"ワークショップ","talks.domestic":"国内",
    "talks.confTitle":"学会発表","talks.confDesc":"世界各地のトップ国際会議での口頭・ポスター発表。",
    "talks.wsDesc":"主要なコンピュータビジョン・機械学習カンファレンスでのワークショップ発表。",
    "talks.domesticDesc":"国内学会での発表。JSAI 2023にて研究賞受賞。",
    "exp.title":"職歴",
    "exp.zozo.dir":"ディレクター、デプロイメント部","exp.zozo.dir.d":"研究成果を大規模プロダクションシステムにデプロイする部門を統括。",
    "exp.zozo.sm":"シニアマネージャー / リード研究者","exp.zozo.sm.d":"R&Dチームを率いる。WWW、ICLR、IJCAI、EMNLPなどで論文発表。LINEヤフー最優秀社員賞受賞（27,000名中上位3名）。",
    "exp.zozo.lead":"リード研究者","exp.zozo.lead.d":"ファッションインテリジェンスシステム、推薦システム、説明可能AIの研究を主導。ZOZOグループ グランプリ受賞（1,700名中上位5名）。",
    "exp.zozo.rs":"研究者",
    "exp.sophia":"上智大学","exp.sophia.r":"非常勤講師、理工学部","exp.sophia.d":"データサイエンス・機械学習の講義を担当。学生評価スコア：4.8/5.0。",
    "exp.waseda.dsi":"早稲田大学","exp.waseda.dsi.r":"招聘研究員、データサイエンス研究所","exp.waseda.dsi.d":"<a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>後藤研究室</a>にて研究指導・メンタリング。4年連続首席指導実績。",
    "exp.ucsd":"カリフォルニア大学サンディエゴ校","exp.ucsd.r":"客員研究員、コンピュータサイエンス学部","exp.ucsd.d":"<a href='https://cseweb.ucsd.edu//~jmcauley/' target='_blank'>Julian McAuley研究室</a>にて推薦システム・LLMに関する研究。",
    "exp.dena":"DeNA Co., Ltd.","exp.dena.r":"ソフトウェアデベロッパー","exp.dena.d":"Ruby、Python、Goによるフルスタック開発とクラウドインフラ（AWS/GCP）。",
    "exp.toreta":"株式会社トレタ","exp.toreta.r":"ソフトウェア開発インターン","exp.toreta.d":"飲食店テックスタートアップでのフルスタック開発インターン。",
    "exp.pksha":"PKSHA Technology","exp.pksha.r":"機械学習エンジニアリングインターン","exp.pksha.d":"先進AIスタートアップでの機械学習エンジニアリングインターン。",
    "exp.azest":"AZEST株式会社","exp.azest.r":"データサイエンスインターン","exp.azest.d":"Tableau・Power BIなどを活用したデータ分析・BIインターン。",
    "edu.title":"学歴",
    "edu.phd":"Ph.D. in Engineering（創造理工学研究科 経営システム工学専攻）","edu.phd.h":["「ZOZO 社会人ドクター制度」による支援受給","指導教員：<a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>後藤正幸教授</a>","研究：推薦システム、説明可能AI、ファッションインテリジェンス"],
    "edu.ms":"修士（工学）創造理工学研究科 経営システム工学専攻","edu.ms.h":["首席卒業","指導教員：<a href='https://www.it.mgmt.waseda.ac.jp/index.html' target='_blank'>後藤正幸教授</a>"],
    "edu.bs":"学士（工学）創造理工学部 経営システム工学科",
    "edu.hs":"高等学院",
    "teaching.title":"教育活動",
    "teaching.sophia":"上智大学 — 非常勤講師","teaching.sophia.d":"理工学部にてデータサイエンスと機械学習の講義を担当。",
    "teaching.sophia.score":"/ 5.0 学生評価平均スコア","teaching.sophia.note":"3年間の講義を通じて、常に高い学生評価を記録。",
    "teaching.waseda":"早稲田大学 — 客員研究員","teaching.waseda.d":"学部生・大学院生の研究指導とメンタリング。",
    "teaching.waseda.streak":"4年連続","teaching.waseda.label":"首席卒業生の指導実績","teaching.waseda.note":"研究指導を行った学生が4年連続で首席卒業を達成しています。",
    "teaching.studentMsg":"これまでに授業や研究指導、<a href='https://ut-base.info/circles/122' target='_blank'>HAIT</a>メンタリングなどで関わった学生の皆さんへ — キャリアや研究で悩みがあれば、いつでも気軽に連絡してください。時間が経っていても関係ありません。<strong>いつでもお待ちしています。</strong>",
    "awards.title":"受賞歴",
    "awards.items":[
{awards_ja}
    ],
    "media.title":"メディア掲載","media.subtitle":"研究成果が100件以上のメディアで取り上げられています。主な掲載先は以下の通りです。",
    "media.more":"その他、主要テックメディア等100件以上に掲載...",
    "service.title":"学術活動","service.reviewer":"国際会議 査読者 / プログラム委員","service.journal":"ジャーナル査読者",
    "projects.title":"Non-Research Projects",
    "projects.tennis":"TaRO's CUP — テニス大会・コミュニティ運営","projects.tennis.d":"テニス大会（TaRO's CUP、第6回以上開催）の主催と活気あるコミュニティの構築。ParadisoやBridgestoneなどのスポンサーと連携し、あらゆるレベルのプレーヤーが参加できるイベントを運営しています。",
    "projects.nepal":"Nepal Japan Project","projects.nepal.d":"日本とネパール間の国際ボランティアプロジェクト（2015年、2016年）。2016年はプロジェクトリーダーとして異文化交流・コミュニティ開発を推進。",
    "projects.wedding":"結婚式リアルタイムクイズアプリ","projects.wedding.d":"友人の結婚式用リアルタイムクイズアプリを開発。WebSocketによる同時接続数100名以上に対応。計3回の結婚式で利用。",
    "projects.apps":"個人アプリ・Web開発","projects.apps.d":"チャットアプリ、テニス大会専用SNS、TaRO&Companyホームページなど。Python、Ruby、Go、Kotlin、Swift、モダンWeb技術を用いたフルスタック開発。",
    "news.showAll":"すべてのニュースを表示","news.showLess":"折りたたむ",
    "talks.showAll":"すべての講演・発表を表示","talks.showLess":"折りたたむ",
    "awards.showAll":"すべての受賞歴を表示","awards.showLess":"折りたたむ",
    "media.showAll":"すべてのメディア掲載を表示","media.showLess":"折りたたむ",
    "collab.title":"講演・共同研究のご依頼","collab.subtitle":"講演依頼、共同研究、イベント共催のご相談を歓迎しています。",
    "collab.research":"共同研究","collab.research.d":"推薦システム、説明可能AI、コンピュータビジョン、LLM分野での共同研究者を積極的に募集しています。一緒にAI研究の最前線を切り拓きましょう。",
    "collab.speaking":"講演依頼","collab.speaking.d":"カンファレンス、ワークショップ、セミナー、企業イベントでの講演依頼を積極的に受け付けています。AI/ML研究、ファッションテック、産学連携などのテーマで講演可能です。",
    "collab.event":"イベント・学会の共催","collab.event.d":"学会やワークショップ、テック勉強会、業界イベントを一緒に企画・運営してくれる方を募集しています。新しいカンファレンスの立ち上げ、ハッカソン、異業種交流イベントなど、一緒に面白いことをやりましょう！",
    "collab.contact":"お気軽にメールまたはLinkedInからご連絡ください。お待ちしております！",
    "collab.email":"お問い合わせ",
    "footer.visitors":"訪問者マップ","footer.update":"最終更新：2026年2月",
  }}"""


def main():
    print("Reading CSV files...")
    pubs = read_csv("publications.csv")
    talks = read_csv("talks.csv")
    media = read_csv("media.csv")
    awards_en = read_csv("awards_en.csv")
    awards_ja = read_csv("awards_ja.csv")
    news_en = read_csv("news_en.csv")
    news_ja = read_csv("news_ja.csv")

    print(f"  publications: {len(pubs)} entries")
    print(f"  talks: {len(talks)} entries")
    print(f"  media: {len(media)} entries")
    print(f"  awards (EN): {len(awards_en)} entries")
    print(f"  awards (JA): {len(awards_ja)} entries")
    print(f"  news (EN): {len(news_en)} entries")
    print(f"  news (JA): {len(news_ja)} entries")

    print("Building js/data.js...")

    pubs_js = build_publications(pubs)
    talks_js = build_talks(talks)
    media_js = build_media(media)
    awards_en_js = build_awards(awards_en)
    awards_ja_js = build_awards(awards_ja)
    news_en_js = build_news(news_en)
    news_ja_js = build_news(news_ja)

    translations_en = TRANSLATIONS_EN_TEMPLATE.format(
        news_en=news_en_js, awards_en=awards_en_js
    )
    translations_ja = TRANSLATIONS_JA_TEMPLATE.format(
        news_ja=news_ja_js, awards_ja=awards_ja_js
    )

    output = f"""// ===== Publications Data =====
// Auto-generated from data/publications.csv — do not edit directly.
// Run: python scripts/build-data.py
{pubs_js}

// ===== Translations =====
const TRANSLATIONS = {{
{translations_en},
{translations_ja}
}};

// ===== Talks Data =====
{talks_js}

// ===== Media Data =====
{media_js}
"""

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"Written to {OUTPUT}")
    print("Done!")


if __name__ == "__main__":
    main()
