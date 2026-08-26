"""Generate a concise PDF intelligence report from the active network."""

from datetime import datetime
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from src.graph.analysis import centrality_analysis, find_clusters, most_connected_nodes


def build_case_report(graph) -> bytes:
    """Return a polished, single-file PDF report for the current network."""
    stream = BytesIO()
    document = SimpleDocTemplate(
        stream,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Aegisx Network Intelligence Report",
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        textColor=colors.HexColor("#102a43"),
        fontSize=22,
        leading=26,
        spaceAfter=5,
    )
    subtitle = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        textColor=colors.HexColor("#486581"),
        fontSize=9,
        leading=13,
        spaceAfter=16,
    )
    heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        textColor=colors.HexColor("#163d5c"),
        fontSize=13,
        spaceBefore=14,
        spaceAfter=8,
    )

    centrality = centrality_analysis(graph)
    ranked = sorted(
        centrality.items(),
        key=lambda item: (item[1]["degree"], item[1]["betweenness"]),
        reverse=True,
    )
    clusters = find_clusters(graph)
    key_id = ranked[0][0] if ranked else "N/A"
    key_name = graph.nodes[key_id].get("name", key_id) if key_id != "N/A" else "N/A"

    story = [
        Paragraph("AEGISX", title),
        Paragraph("Network Intelligence Case Report", styles["Heading2"]),
        Paragraph(
            f"Generated {datetime.now().strftime('%d %b %Y, %H:%M')} | Live network snapshot",
            subtitle,
        ),
        Paragraph("Executive summary", heading),
        Paragraph(
            f"The current network contains <b>{graph.number_of_nodes()}</b> entities and "
            f"<b>{graph.number_of_edges()}</b> relationships across <b>{len(clusters)}</b> "
            f"connected group{'s' if len(clusters) != 1 else ''}. The leading entity is "
            f"<b>{key_name} ({key_id})</b>.",
            styles["BodyText"],
        ),
        Spacer(1, 9),
        Table(
            [["Entities", "Relationships", "Clusters", "Key entity"], [
                str(graph.number_of_nodes()), str(graph.number_of_edges()), str(len(clusters)), key_id
            ]],
            colWidths=[39 * mm, 43 * mm, 35 * mm, 48 * mm],
            style=TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#163d5c")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#eaf2f8")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica-Bold"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#b8c7d6")),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]),
        ),
        Paragraph("Priority entities", heading),
    ]

    priority_rows = [["Rank", "Entity", "Type", "Direct connections", "Betweenness"]]
    for rank, (entity_id, score) in enumerate(ranked[:5], start=1):
        entity = graph.nodes[entity_id]
        priority_rows.append([
            str(rank),
            f"{entity.get('name', entity_id)} ({entity_id})",
            entity.get("type", "Unknown"),
            str(graph.degree(entity_id)),
            str(score["betweenness"]),
        ])
    story.append(Table(
        priority_rows,
        colWidths=[15 * mm, 60 * mm, 35 * mm, 31 * mm, 24 * mm],
        repeatRows=1,
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#285c80")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BACKGROUND", (0, 1), (-1, -1), colors.white),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f3f7fa")]),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#c3d1dc")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]),
    ))

    story.extend([Paragraph("Network groups", heading)])
    for number, cluster in enumerate(clusters, start=1):
        names = [f"{graph.nodes[node].get('name', node)} ({node})" for node in sorted(cluster)]
        story.append(Paragraph(f"<b>Cluster {number}:</b> {', '.join(names)}", styles["BodyText"]))
        story.append(Spacer(1, 4))

    document.build(story)
    return stream.getvalue()
