#!/usr/bin/env python3
"""Build data/certificates.json and generate real JPG thumbnails from the
source certificate PDFs already checked into assets/images/.

Run from the repo root: python3 scripts/build_certificates.py
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets" / "images"
THUMBS_DIR = ASSETS / "cert-thumbs"
THUMBS_DIR.mkdir(parents=True, exist_ok=True)

CERTS = []

def add(id_, title, provider, issuer, category, date, credential_id, credential_url, pdf_rel, skills):
    CERTS.append({
        "id": id_,
        "title": title,
        "provider": provider,
        "issuer": issuer,
        "category": category,
        "date": date,
        "credential_id": credential_id,
        "credential_url": credential_url,
        "certificate_file": f"assets/images/{pdf_rel}",
        "image": f"assets/images/cert-thumbs/{id_}.jpg",
        "skills": skills,
    })

# ---------- Coursera (21) ----------
add(1, "Machine Learning With Big Data", "Coursera", "University of California San Diego", "Machine Learning", "2024", "0Y3PNESDL82F", "https://coursera.org/verify/0Y3PNESDL82F", "certificates/Coursera 0Y3PNESDL82F Machine Learning With Big Data.pdf", ["Machine Learning", "Big Data", "Apache Spark", "Data Mining"])
add(2, "Introduction to Statistics", "Coursera", "Stanford University", "Statistics", "2024", "1XLQVNWZU93H", "https://coursera.org/verify/1XLQVNWZU93H", "certificates/Coursera 1XLQVNWZU93H Introduction to Statistics.pdf", ["Statistics", "Probability", "Data Analysis", "Statistical Inference"])
add(3, "People, Technology and the Future of Mobility", "Coursera", "University of Michigan", "Transportation", "2024", "2AL1LAM39UTD", "https://coursera.org/verify/2AL1LAM39UTD", "certificates/Coursera 2AL1LAM39UTD People, Technology and the Future of Mobility.pdf", ["Future Mobility", "Transportation Technology", "Urban Planning"])
add(4, "Sustainable Neighborhoods", "Coursera", "Johns Hopkins University", "Sustainable Cities", "2024", "3BKGBZ4KBVU4", "https://coursera.org/verify/3BKGBZ4KBVU4", "certificates/Coursera 3BKGBZ4KBVU4 Sustainable Neighborhoods.pdf", ["Urban Sustainability", "Neighborhood Planning", "Green Infrastructure"])
add(5, "Graph Analytics for Big Data", "Coursera", "University of California San Diego", "Big Data", "2024", "4QSK1TL68UW7", "https://coursera.org/verify/4QSK1TL68UW7", "certificates/Coursera 4QSK1TL68UW7 Graph Analytics for Big Data.pdf", ["Graph Analytics", "Big Data", "Network Analysis", "Graph Algorithms"])
add(6, "Supervised Machine Learning: Regression", "Coursera", "IBM", "Machine Learning", "2024", "6EO5QYA25XKE", "https://coursera.org/verify/6EO5QYA25XKE", "certificates/Coursera 6EO5QYA25XKE Supervised Machine Learning Regression.pdf", ["Supervised Learning", "Regression", "Predictive Modeling", "Machine Learning"])
add(7, "Smart Cities – Management of Smart Urban Infrastructures", "Coursera", "École Polytechnique Fédérale de Lausanne", "Smart Cities", "2024", "6LCJTXRWVNK8", "https://coursera.org/verify/6LCJTXRWVNK8", "certificates/Coursera 6LCJTXRWVNK8 Smart Cities – Management of Smart Urban Infrastructures.pdf", ["Smart Cities", "Urban Infrastructure", "IoT", "City Management"])
add(8, "Using Python to Access Web Data", "Coursera", "University of Michigan", "Python Programming", "2024", "7VQQ4NJARECZ", "https://coursera.org/verify/7VQQ4NJARECZ", "certificates/Coursera 7VQQ4NJARECZ Using Python to Access Web Data.pdf", ["Python", "Web Scraping", "APIs", "Data Collection"])
add(9, "Sustainable Transportation Networks and Streetscapes", "Coursera", "Johns Hopkins University", "Transportation", "2024", "BKR4D2LD1QCU", "https://coursera.org/verify/BKR4D2LD1QCU", "certificates/Coursera BKR4D2LD1QCU Sustainable Transportation Networks and Streetscapes.pdf", ["Sustainable Transportation", "Network Design", "Street Planning"])
add(10, "Introduction to Big Data", "Coursera", "University of California San Diego", "Big Data", "2024", "C8YXW5DBJQR8", "https://coursera.org/verify/C8YXW5DBJQR8", "certificates/Coursera C8YXW5DBJQR8 Introduction to Big Data.pdf", ["Big Data", "Hadoop", "Data Processing", "Distributed Systems"])
add(11, "Python Data Structures", "Coursera", "University of Michigan", "Python Programming", "2024", "IJPPXEQ6AB9H", "https://coursera.org/verify/IJPPXEQ6AB9H", "certificates/Coursera IJPPXEQ6AB9H Python Data Structures.pdf", ["Python", "Data Structures", "Algorithms", "Programming"])
add(12, "Big Data Modeling and Management Systems", "Coursera", "University of California San Diego", "Big Data", "2024", "JG61VM426P9Z", "https://coursera.org/verify/JG61VM426P9Z", "certificates/Coursera JG61VM426P9Z Big Data Modeling and Management Systems.pdf", ["Big Data", "Data Modeling", "Database Management", "NoSQL"])
add(13, "Big Data Integration and Processing", "Coursera", "University of California San Diego", "Big Data", "2024", "NRKFYVSKRCJ4", "https://coursera.org/verify/NRKFYVSKRCJ4", "certificates/Coursera NRKFYVSKRCJ4 Big Data Integration and Processing.pdf", ["Big Data", "Data Integration", "ETL", "Data Processing"])
add(14, "MaaS: Adoption and Use", "Coursera", "Eindhoven University of Technology", "Transportation", "2024", "ORSMBL078570", "https://coursera.org/verify/ORSMBL078570", "certificates/Coursera ORSMBL078570_MaaS Adoption and Use.pdf", ["Mobility as a Service", "Transportation Planning", "Shared Mobility"])
add(15, "Programming for Everybody (Getting Started with Python)", "Coursera", "University of Michigan", "Python Programming", "2024", "PPHDUNXE2SN3", "https://coursera.org/verify/PPHDUNXE2SN3", "certificates/Coursera PPHDUNXE2SN3 Programming for Everybody (Getting Started with Python).pdf", ["Python", "Programming Fundamentals", "Coding"])
add(16, "Electric Vehicles and Mobility", "Coursera", "École des Ponts ParisTech", "Transportation", "2024", "PY0JLARWMWL0", "https://coursera.org/verify/PY0JLARWMWL0", "certificates/Coursera PY0JLARWMWL0 Electric Vehicles and Mobility.pdf", ["Electric Vehicles", "Sustainable Mobility", "EV Infrastructure"])
add(17, "Sustainable Cities Specialization", "Coursera", "Johns Hopkins University", "Specialization", "2024", "R1Z8ITTWNH9U", "https://coursera.org/verify/R1Z8ITTWNH9U", "certificates/Coursera R1Z8ITTWNH9U Sustainable Cities_Specialization.pdf", ["Sustainable Cities", "Urban Planning", "Green Infrastructure", "Transportation"])
add(18, "Capstone: Retrieving, Processing, and Visualizing Data with Python", "Coursera", "University of Michigan", "Python Programming", "2024", "Y9F02CG57BX9", "https://coursera.org/verify/Y9F02CG57BX9", "certificates/Coursera Y9F02CG57BX9 Capstone Retrieving, Processing, and Visualizing Data with Python.pdf", ["Python", "Data Visualization", "Data Processing", "APIs"])
add(19, "Sustainable Regional Principles, Planning and Transportation", "Coursera", "Johns Hopkins University", "Transportation", "2024", "YXRZP39HL450", "https://coursera.org/verify/YXRZP39HL450", "certificates/Coursera YXRZP39HL450 Sustainable Regional Principles, Planning and Transportation.pdf", ["Regional Planning", "Sustainable Transportation", "Urban Development"])
add(20, "Exploratory Data Analysis for Machine Learning", "Coursera", "IBM", "Machine Learning", "2024", "Z18BLOOBJ2WY", "https://coursera.org/verify/Z18BLOOBJ2WY", "certificates/Coursera Z18BLOOBJ2WY Exploratory Data Analysis for Machine Learning.pdf", ["Exploratory Data Analysis", "Machine Learning", "Data Visualization"])
add(21, "Transportation, Sustainable Buildings, Green Construction", "Coursera", "Johns Hopkins University", "Sustainable Cities", "2024", "ZYT3DVBM6BJE", "https://coursera.org/verify/ZYT3DVBM6BJE", "certificates/Coursera ZYT3DVBM6BJE Transportation, Sustainable Buildings, Green Construction.pdf", ["Green Construction", "Sustainable Buildings", "Transportation Planning"])

# ---------- Elsevier Recognized Reviewer certificates (one per journal) ----------
add(22, "Recognized Reviewer – Acta Psychologica", "Elsevier", "Acta Psychologica", "Peer Review", "2026-04", "ELSEVIER-REVIEWER-ACTPSY", "", "Elsevier Reviewer Certificate/Certificate_ACTPSY_Recognised.pdf", ["Peer Review", "Psychology", "Manuscript Evaluation"])
add(23, "Recognized Reviewer – Ain Shams Engineering Journal", "Elsevier", "Ain Shams Engineering Journal", "Peer Review", "2026-03", "ELSEVIER-REVIEWER-ASEJ", "", "Elsevier Reviewer Certificate/Certificate_ASEJ_Recognised.pdf", ["Peer Review", "Engineering", "Manuscript Evaluation"])
add(24, "Recognized Reviewer – Engineering Applications of Artificial Intelligence", "Elsevier", "Engineering Applications of Artificial Intelligence", "Peer Review", "2026-05", "ELSEVIER-REVIEWER-EAAI", "", "Elsevier Reviewer Certificate/Certificate_EAAI_Recognised.pdf", ["Peer Review", "Artificial Intelligence", "Manuscript Evaluation"])
add(25, "Recognized Reviewer – Economic Analysis and Policy", "Elsevier", "Economic Analysis and Policy", "Peer Review", "2026-05", "ELSEVIER-REVIEWER-EAP", "", "Elsevier Reviewer Certificate/Certificate_EAP_Recognised.pdf", ["Peer Review", "Economics", "Manuscript Evaluation"])
add(26, "Recognized Reviewer – Journal of Cleaner Production", "Elsevier", "Journal of Cleaner Production", "Peer Review", "2026-03", "ELSEVIER-REVIEWER-JCLP", "", "Elsevier Reviewer Certificate/Certificate_JCLP_Recognised.pdf", ["Peer Review", "Sustainability", "Manuscript Evaluation"])
add(27, "Recognized Reviewer – Journal of Traffic and Transportation Engineering", "Elsevier", "Journal of Traffic and Transportation Engineering (English Edition)", "Peer Review", "2026-05", "ELSEVIER-REVIEWER-JTTE", "", "Elsevier Reviewer Certificate/Certificate_JTTE_Recognised.pdf", ["Peer Review", "Transportation Engineering", "Manuscript Evaluation"])
add(28, "Recognized Reviewer – Measurement", "Elsevier", "Measurement", "Peer Review", "2026-02", "ELSEVIER-REVIEWER-MEASUR", "", "Elsevier Reviewer Certificate/Certificate_MEASUR_Recognised.pdf", ["Peer Review", "Measurement Science", "Manuscript Evaluation"])
add(29, "Recognized Reviewer – Transportation Research Interdisciplinary Perspectives", "Elsevier", "Transportation Research Interdisciplinary Perspectives", "Peer Review", "2026-06", "ELSEVIER-REVIEWER-TRIP", "", "Elsevier Reviewer Certificate/Certificate_TRIP_Recognised.pdf", ["Peer Review", "Transportation Research", "Manuscript Evaluation"])

# ---------- Elsevier Researcher Academy: EVERY module certificate ----------
# Auto-generated from every PDF actually present in each course folder,
# rather than just one representative certificate per course.
ELSEVIER_FOLDER_CATEGORY = {
    "Becoming a peer reviewer": "Academic Publishing",
    "Certified Peer Reviewer Course": "Academic Publishing",
    "Fundamentals of manuscript preparation": "Academic Writing",
    "Fundamentals of peer review": "Academic Publishing",
    "Fundamentals of publishing": "Academic Publishing",
    "Going through peer review": "Academic Publishing",
    "Research data management": "Research Skills",
    "Research design": "Research Skills",
    "Research metrics": "Research Skills",
    "Technical writing skills": "Academic Writing",
    "Writing Skills": "Academic Writing",
}

ACRONYMS = {"ai": "AI", "orcid": "ORCID", "qa": "Q&A", "id": "ID", "sjr": "SJR",
            "snip": "SNIP", "plumx": "PlumX", "fair": "FAIR"}
SMALL_WORDS = {"a", "an", "the", "of", "to", "in", "on", "for", "and", "or",
               "is", "are", "not", "your", "you"}

def slug_to_title(stem: str) -> str:
    s = stem
    if s.endswith("-certificate"):
        s = s[: -len("-certificate")]
    parts = s.split("-")
    if parts and parts[0].isdigit():
        parts = parts[1:]
    words = []
    for i, w in enumerate(parts):
        lw = w.lower()
        if lw in ACRONYMS:
            words.append(ACRONYMS[lw])
        elif i > 0 and lw in SMALL_WORDS:
            words.append(lw)
        else:
            words.append(w.capitalize())
    return " ".join(words)

_elsevier_id = 100
ELSEVIER_ROOT = ASSETS / "Research Academy _Elsevier"
for folder in sorted(ELSEVIER_ROOT.iterdir()):
    if not folder.is_dir():
        continue
    category = ELSEVIER_FOLDER_CATEGORY.get(folder.name, "Academic Publishing")
    for pdf in sorted(folder.glob("*.pdf")):
        title = slug_to_title(pdf.stem)
        rel = f"Research Academy _Elsevier/{folder.name}/{pdf.name}"
        add(
            _elsevier_id,
            title,
            "Elsevier Researcher Academy",
            "Elsevier",
            category,
            "2024",
            f"ELSEVIER-{_elsevier_id}",
            "https://researcheracademy.elsevier.com/",
            rel,
            [folder.name, "Elsevier Researcher Academy"],
        )
        _elsevier_id += 1

# ---------- Conference / Competition / Awards ----------
add(33, "Best International Student Award 2024", "Conference Award", "Chulalongkorn University", "Awards & Honors", "2024", "AWARD-BISA-2024", "", "conference certificate/Best International Student Award_2024.pdf", ["Academic Excellence", "International Recognition"])
add(34, "Research Paper Presenter – IICAIET 2025", "Conference Presentation", "International Conference on AI, IoT & Engineering Technology", "Conference Presentations", "2025", "IICAIET-2025", "", "conference certificate/IICAIET2025 Certificate_Presenter_187 188 190 Mahbub.pdf", ["Research Presentation", "AI", "IoT", "Engineering"])
add(35, "Research Paper Presenter – IICAIET 2024 (Malaysia)", "Conference Presentation", "Universiti Malaysia Sabah", "Conference Presentations", "2024", "IICAIET-2024-UMS", "", "conference certificate/Research Paper Presenter_ IICAIET2024_UMS_Malaysia_2024.pdf", ["Research Presentation", "Transportation", "AI"])
add(36, "Research Paper Presenter – APTE 2024 (Singapore)", "Conference Presentation", "National University of Singapore", "Conference Presentations", "2024", "APTE-2024-NUS", "", "conference certificate/Research Paper Presenter_APTE_NUS_Singapore_2024.pdf", ["Research Presentation", "Transportation Engineering"])
add(37, "Research Paper Presenter – Civentech 2023 (Malaysia)", "Conference Presentation", "Universiti Malaysia Perlis", "Conference Presentations", "2023", "CIVENTECH-2023", "", "conference certificate/Research Paper Presenter_Civentech_UniMAP_Malaysia_2023.pdf", ["Research Presentation", "Civil Engineering"])
add(38, "Winner – Second Position, FYP Competition", "Competition Award", "Universiti Malaysia Perlis", "Awards & Honors", "2024", "FYP-2024-2ND", "", "conference certificate/Winner Second Position_FYP Compettion_UniMAP_Malaysia_2024.pdf", ["Project Management", "Research Excellence"])
add(39, "3rd Place – International Concrete Competition", "Competition Award", "Indonesia", "Awards & Honors", "2024", "ICC-2024-3RD", "", "conference certificate/3rd Place_International Concrete Competition _Indonesia.pdf", ["Concrete Technology", "Competition"])
add(40, "IEEE Conference Presentation – Malaysia", "Conference Presentation", "IEEE Malaysia", "Conference Presentations", "2024", "IEEE-MY-2024", "", "conference certificate/Malaysia ieee conference.pdf", ["IEEE", "Research Presentation", "Transportation"])
add(41, "Conference Presentation – Saudi Arabia", "Conference Presentation", "Saudi Arabia", "Conference Presentations", "2024", "SA-CONF-2024", "", "conference certificate/saudi arabia.pdf", ["International Presentation", "Research"])
add(42, "Conference Presentation – India (1)", "Conference Presentation", "India", "Conference Presentations", "2024", "INDIA-CONF-2024-1", "", "conference certificate/india 1.pdf", ["International Presentation", "Research"])
add(43, "Conference Presentation – India (2)", "Conference Presentation", "India", "Conference Presentations", "2024", "INDIA-CONF-2024-2", "", "conference certificate/india 2.pdf", ["International Presentation", "Research"])
add(56, "Certificate – CIVINTECH 2023", "Conference Presentation", "Universiti Malaysia Perlis", "Conference Presentations", "2023", "CIVINTECH-2023-34", "", "conference certificate/CERTIFICATE CIVINTECH 2023 34.pdf", ["Civil Engineering", "Conference Participation"])
add(57, "IIC 2025 Conference Certificate", "Conference Presentation", "International Conference", "Conference Presentations", "2025", "IIC-2025", "", "conference certificate/iic2025.pdf", ["Research Presentation", "International Conference"])
add(58, "IIC 2025 Conference Certificate (2)", "Conference Presentation", "International Conference", "Conference Presentations", "2025", "IIC-2025-2", "", "conference certificate/iic 2025-2.pdf", ["Research Presentation", "International Conference"])
# NOTE: id 59 (BEM Graduate Engineer certificate) intentionally omitted —
# the source PDF exposes a national ID card number and home address, which
# must not be published publicly.
add(60, "Dean's List Award – 6th Semester", "Academic Honor", "Universiti Malaysia Perlis", "Awards & Honors", "2023", "DEANS-6TH-2023", "", "conference certificate/Dean_s Award_6th Semester_2023.pdf", ["Academic Excellence", "Dean's List"])
add(61, "Dean's List Award – 7th Semester", "Academic Honor", "Universiti Malaysia Perlis", "Awards & Honors", "2024", "DEANS-7TH-2024", "", "conference certificate/Dean_s Award_7th Semester_2024.pdf", ["Academic Excellence", "Dean's List"])

# ---------- Peer Review / Reviewer Certification ----------
add(46, "Peer Reviewer Certificate – 21 January 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-21", "", "Reviewer Certification/Reviewer Certificate 21 January 2026 (1).pdf", ["Peer Review", "Manuscript Evaluation"])
add(47, "Peer Reviewer Certificate – 15 January 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-15-1", "", "Reviewer Certification/Reviewer Certificate 15 January 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(48, "Peer Reviewer Certificate – 15 January 2026 (2)", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-15-2", "", "Reviewer Certification/Reviewer Certificate 15 January 2026 (1).pdf", ["Peer Review", "Manuscript Evaluation"])
add(54, "Peer Reviewer Certificate – 15 January 2026 (3)", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-15-3", "", "Reviewer Certification/Reviewer Certificate 15 January 2026 (2).pdf", ["Peer Review", "Manuscript Evaluation"])
add(55, "Peer Reviewer Certificate – 15 January 2026 (4)", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-15-4", "", "Reviewer Certification/Reviewer Certificate 15 January 2026 (3).pdf", ["Peer Review", "Manuscript Evaluation"])
add(49, "Peer Reviewer Certificate – 04 January 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-01", "REVIEW-2026-01-04", "", "Reviewer Certification/Reviewer Certificate 04 January 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(50, "Peer Reviewer Certificate – 19 November 2025", "Peer Review", "Academic Journal", "Peer Review", "2025-11", "REVIEW-2025-11-19", "", "Reviewer Certification/Reviewer Certificate 19 November 2025 (1).pdf", ["Peer Review", "Manuscript Evaluation"])
add(51, "Peer Reviewer Certificate – 08 November 2025", "Peer Review", "Academic Journal", "Peer Review", "2025-11", "REVIEW-2025-11-08", "", "Reviewer Certification/Reviewer Certificate 08 November 2025.pdf", ["Peer Review", "Manuscript Evaluation"])
add(52, "Peer Reviewer Certificate – 16 October 2025", "Peer Review", "Academic Journal", "Peer Review", "2025-10", "REVIEW-2025-10-16", "", "Reviewer Certification/Reviewer Certificate 16 October 2025.pdf", ["Peer Review", "Manuscript Evaluation"])
add(53, "Peer Reviewer Certificate – 26 September 2025", "Peer Review", "Academic Journal", "Peer Review", "2025-09", "REVIEW-2025-09-26", "", "Reviewer Certification/Reviewer Certificate 26 September 2025.pdf", ["Peer Review", "Manuscript Evaluation"])
add(62, "Peer Reviewer Certificate – 01 March 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-03", "REVIEW-2026-03-01", "", "Reviewer Certification/Reviewer Certificate 01 March 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(63, "Peer Reviewer Certificate – 02 May 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-05", "REVIEW-2026-05-02", "", "Reviewer Certification/Reviewer Certificate 02 May 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(64, "Peer Reviewer Certificate – 13 March 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-03", "REVIEW-2026-03-13-1", "", "Reviewer Certification/Reviewer Certificate 13 March 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(65, "Peer Reviewer Certificate – 13 March 2026 (2)", "Peer Review", "Academic Journal", "Peer Review", "2026-03", "REVIEW-2026-03-13-2", "", "Reviewer Certification/Reviewer Certificate 13 March 2026 (1).pdf", ["Peer Review", "Manuscript Evaluation"])
add(66, "Peer Reviewer Certificate – 17 April 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-04", "REVIEW-2026-04-17", "", "Reviewer Certification/Reviewer Certificate 17 April 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(67, "Peer Reviewer Certificate – 19 November 2025 (2)", "Peer Review", "Academic Journal", "Peer Review", "2025-11", "REVIEW-2025-11-19-2", "", "Reviewer Certification/Reviewer Certificate 19 November 2025.pdf", ["Peer Review", "Manuscript Evaluation"])
add(68, "Peer Reviewer Certificate – 09 September 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-09", "REVIEW-2026-09-09", "", "Reviewer Certification/Reviewer Certificate 09 September 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(69, "Peer Reviewer Certificate – 11 June 2026", "Peer Review", "Academic Journal", "Peer Review", "2026-06", "REVIEW-2026-06-11-1", "", "Reviewer Certification/Reviewer Certificate 11 June 2026.pdf", ["Peer Review", "Manuscript Evaluation"])
add(70, "Peer Reviewer Certificate – 11 June 2026 (2)", "Peer Review", "Academic Journal", "Peer Review", "2026-06", "REVIEW-2026-06-11-2", "", "Reviewer Certification/Reviewer Certificate 11 June 2026 (1).pdf", ["Peer Review", "Manuscript Evaluation"])
add(71, "Peer Reviewer Certificate – 11 June 2026 (3)", "Peer Review", "Academic Journal", "Peer Review", "2026-06", "REVIEW-2026-06-11-3", "", "Reviewer Certification/Reviewer Certificate 11 June 2026 (2).pdf", ["Peer Review", "Manuscript Evaluation"])
add(72, "TRB Annual Meeting 2027 – Peer Reviewer", "Peer Review", "Transportation Research Board (TRB)", "Peer Review", "2027", "TRB-2027", "", "Reviewer Certification/TRB Annual Meeting 2027.jpeg", ["Peer Review", "Transportation Research", "Manuscript Evaluation"])

# ---------- Categories summary ----------
from collections import Counter
cat_counts = Counter(c["category"] for c in CERTS)
provider_set = sorted({c["provider"] for c in CERTS})

CATEGORY_ICONS = {
    "Machine Learning": "brain-circuit",
    "Statistics": "bar-chart-3",
    "Transportation": "route",
    "Sustainable Cities": "leaf",
    "Big Data": "database",
    "Smart Cities": "building-2",
    "Python Programming": "code-2",
    "Specialization": "graduation-cap",
    "Academic Publishing": "book-open-check",
    "Academic Writing": "pen-line",
    "Research Skills": "flask-conical",
    "Awards & Honors": "trophy",
    "Conference Presentations": "presentation",
    "Peer Review": "clipboard-check",
    "Professional Certification": "shield-check",
    "Academic Honor": "medal",
}

categories = [{"name": name, "count": count, "icon": CATEGORY_ICONS.get(name, "award")} for name, count in sorted(cat_counts.items())]

data = {
    "certificates": sorted(CERTS, key=lambda c: c["id"]),
    "categories": categories,
    "stats": {
        "total_certificates": len(CERTS),
        "specializations": sum(1 for c in CERTS if c["category"] == "Specialization"),
        "providers": provider_set,
    },
}

out_path = ROOT / "data" / "certificates.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
print(f"Wrote {len(CERTS)} certificates to {out_path}")

# ---------- Generate thumbnails ----------
ok, fail = 0, 0
for c in CERTS:
    src_path = ROOT / c["certificate_file"]
    thumb_path = ROOT / c["image"]
    if not src_path.exists():
        print("MISSING SOURCE:", src_path)
        fail += 1
        continue
    if thumb_path.exists():
        ok += 1
        continue

    if src_path.suffix.lower() in (".jpg", ".jpeg", ".png"):
        # Already an image — just copy and resize in place.
        subprocess.run(["cp", str(src_path), str(thumb_path)], capture_output=True, text=True)
        subprocess.run(["sips", "-Z", "1100", "-s", "format", "jpeg", str(thumb_path)], capture_output=True, text=True)
        if thumb_path.exists():
            ok += 1
        else:
            print("FAILED to copy image:", src_path)
            fail += 1
        continue

    prefix = str(thumb_path.with_suffix(""))
    result = subprocess.run(
        ["pdftoppm", "-jpeg", "-r", "120", "-f", "1", "-l", "1", str(src_path), prefix],
        capture_output=True, text=True
    )
    generated = thumb_path.with_name(thumb_path.stem + "-1.jpg")
    if generated.exists():
        generated.rename(thumb_path)
        # cap max dimension to control file size
        subprocess.run(["sips", "-Z", "1100", str(thumb_path)], capture_output=True, text=True)
        ok += 1
    else:
        print("FAILED to convert:", src_path, result.stderr[:200])
        fail += 1

print(f"Thumbnails: {ok} ok, {fail} failed")
