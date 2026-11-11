"""
Script to generate the official FabriCare Project Documentation PDF
reflecting the 100% REAL architecture, models, APIs, and workflows of the codebase.
Prepared by Pratiksha Harode, Priyanka Kushwah.
"""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Preformatted
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register TrueType Fonts for clean modern typography & box-drawing characters
fonts_dir = r'C:\Windows\Fonts'
has_segoe = os.path.exists(os.path.join(fonts_dir, 'segoeui.ttf'))
has_consolas = os.path.exists(os.path.join(fonts_dir, 'consola.ttf'))

if has_segoe:
    pdfmetrics.registerFont(TTFont('SegoeUI', os.path.join(fonts_dir, 'segoeui.ttf')))
    pdfmetrics.registerFont(TTFont('SegoeUI-Bold', os.path.join(fonts_dir, 'segoeuib.ttf')))
    pdfmetrics.registerFont(TTFont('SegoeUI-Italic', os.path.join(fonts_dir, 'segoeuii.ttf')))
    F_MAIN = 'SegoeUI'
    F_BOLD = 'SegoeUI-Bold'
    F_ITALIC = 'SegoeUI-Italic'
else:
    F_MAIN = 'Helvetica'
    F_BOLD = 'Helvetica-Bold'
    F_ITALIC = 'Helvetica-Oblique'

if has_consolas:
    pdfmetrics.registerFont(TTFont('Consolas', os.path.join(fonts_dir, 'consola.ttf')))
    F_MONO = 'Consolas'
else:
    F_MONO = 'Courier'

# --- Numbered Canvas for Running Footer on Every Page ---
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont(F_MAIN, 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Geometry: A4 width = 595.27, margin = 42 on left/right -> 511.27 usable
        left = 42
        right = 595.27 - 42
        y = 36
        
        # Thin divider rule above footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(left, y + 14, right, y + 14)
        
        # Left footer label
        self.drawString(left, y, "FABRICARE | PROJECT DOCUMENTATION")
        
        # Right footer page number
        page_str = f"Page {self._pageNumber}"
        self.drawRightString(right, y, page_str)
        
        self.restoreState()


def build_pdf(filename="FabriCare_Project_Documentation.pdf"):
    # Page setup
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=42,
        rightMargin=42,
        topMargin=44,
        bottomMargin=54
    )

    usable_width = 595.27 - 84  # 511.27 pt

    # Base Styles
    styles = getSampleStyleSheet()

    # Custom palette matching modern documentation design
    C_PRIMARY = colors.HexColor("#1E3A5F")     # Deep slate navy
    C_HEADING = colors.HexColor("#0F172A")     # Dark slate
    C_BODY = colors.HexColor("#334155")        # Slate body text
    C_MUTED = colors.HexColor("#64748B")       # Muted gray
    C_BORDER = colors.HexColor("#CBD5E1")      # Border gray
    C_HEADER_BG = colors.HexColor("#F1F5F9")   # Light gray header bg
    C_TREE_BG = colors.HexColor("#F8FAFC")     # Soft tree bg

    # Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=28,
        leading=34,
        textColor=C_PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName=F_MAIN,
        fontSize=15,
        leading=19,
        textColor=C_MUTED,
        spaceAfter=18
    )

    sec_label_style = ParagraphStyle(
        'DocSecLabel',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=11,
        leading=14,
        textColor=C_HEADING,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=15,
        leading=19,
        textColor=C_PRIMARY,
        spaceBefore=0,
        spaceAfter=7
    )

    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=10.5,
        leading=13.5,
        textColor=C_HEADING,
        spaceBefore=7,
        spaceAfter=3.5
    )

    sub_h2_style = ParagraphStyle(
        'DocSubH2',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=11.5,
        leading=14.5,
        textColor=C_PRIMARY,
        spaceBefore=7,
        spaceAfter=2
    )

    folder_label_style = ParagraphStyle(
        'DocFolder',
        parent=styles['Normal'],
        fontName=F_MAIN,
        fontSize=8.5,
        leading=11,
        textColor=C_MUTED,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName=F_MAIN,
        fontSize=8.8,
        leading=13,
        textColor=C_BODY,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName=F_MAIN,
        fontSize=8.5,
        leading=12,
        textColor=C_BODY,
        leftIndent=12,
        firstLineIndent=-10,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'DocTH',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=8.5,
        leading=11,
        textColor=C_HEADING
    )

    table_cell_style = ParagraphStyle(
        'DocTD',
        parent=styles['Normal'],
        fontName=F_MAIN,
        fontSize=8.2,
        leading=11,
        textColor=C_BODY
    )

    table_cell_bold = ParagraphStyle(
        'DocTDBold',
        parent=styles['Normal'],
        fontName=F_BOLD,
        fontSize=8.2,
        leading=11,
        textColor=C_HEADING
    )

    note_style = ParagraphStyle(
        'DocNote',
        parent=styles['Normal'],
        fontName=F_ITALIC,
        fontSize=8,
        leading=11.5,
        textColor=C_MUTED,
        spaceBefore=6,
        spaceAfter=6
    )

    tree_style = ParagraphStyle(
        'DocTree',
        fontName=F_MONO,
        fontSize=7.6,
        leading=9.8,
        textColor=colors.HexColor("#1E293B")
    )

    def make_tree_box(tree_text, width=usable_width):
        pre = Preformatted(tree_text.strip(), tree_style)
        t = Table([[pre]], colWidths=[width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), C_TREE_BG),
            ('BOX', (0, 0), (-1, -1), 0.5, C_BORDER),
            ('TOPPADDING', (0, 0), (-1, -1), 4.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ]))
        return t

    story = []

    # =========================================================================
    # PAGE 1: TITLE & PROJECT DOCUMENTATION OVERVIEW
    # =========================================================================
    story.append(Paragraph("FABRICARE", title_style))
    story.append(Paragraph("Laundry Management System", subtitle_style))
    story.append(Paragraph("PROJECT DOCUMENTATION", sec_label_style))

    # Page 1 Metadata Table
    p1_data = [
        [Paragraph("Team", table_cell_bold), Paragraph("Software Development Team Documentation", table_cell_style)],
        [Paragraph("Project Name", table_cell_bold), Paragraph("FabriCare (Laundrix Ecosystem)", table_cell_style)],
        [Paragraph("Department", table_cell_bold), Paragraph("Software Development Team", table_cell_style)],
        [Paragraph("Prepared By", table_cell_bold), Paragraph("Pratiksha Harode, Priyanka Kushwah", table_cell_style)],
        [Paragraph("Date", table_cell_bold), Paragraph("10.11.2026", table_cell_style)]
    ]
    p1_table = Table(p1_data, colWidths=[130, usable_width - 130])
    p1_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(p1_table)
    story.append(Spacer(1, 18))

    story.append(Paragraph(
        "A connected workflow for customer booking, pickup, laundry processing and final delivery.",
        body_style
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Technology direction:</b> React 18 + Vite · Django 5.1 REST Framework · Firebase Realtime Database & SQLite / PostgreSQL",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: 1. PROJECT OVERVIEW & OBJECTIVES
    # =========================================================================
    story.append(Paragraph("1. Project Overview", h1_style))
    story.append(Paragraph(
        "FabriCare is a modern laundry and dry cleaning management platform connecting four user roles (Customer, "
        "Administrator, Laundry Staff, and Delivery Partner) through a unified real-time order lifecycle. "
        "This document defines the actual portal structure, technical architecture, and end-to-end operational workflow.",
        body_style
    ))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Project objectives", h2_style))
    p2_bullets = [
        "Allow customers to choose laundry services, select items with custom quantities, and place orders with verified pickup address and scheduled time slot.",
        "Allow admin to review new orders in real time, accept or reject them, assign pickup executives, and monitor hub throughput.",
        "Allow delivery staff to manage assigned pickup tasks, verify customer collection via secure 4-digit email OTP, and confirm handover at the laundry hub.",
        "Allow laundry staff to verify garment counts, track live processing stages (Washing, Drying, Ironing), perform quality checks, and pack orders.",
        "Assign completed orders for final doorstep delivery, verify delivery OTP, record payment collection, and complete order lifecycle.",
        "Maintain one unified order ID with real-time status synchronization across all four portals via Firebase Realtime Database and Django REST APIs."
    ]
    for b in p2_bullets:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{b}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Technology direction", h2_style))

    p2_tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology", table_header_style), Paragraph("Responsibility", table_header_style)],
        [Paragraph("Frontend", table_cell_bold), Paragraph("React 18 · Vite 6 · Tailwind CSS · Lucide React", table_cell_style), Paragraph("Role-based portal interfaces, dynamic multi-step booking, real-time order tracking, camera image uploads and responsive styling.", table_cell_style)],
        [Paragraph("Backend", table_cell_bold), Paragraph("Django 5.1 · Django REST Framework · SimpleJWT", table_cell_style), Paragraph("Business logic, role permissions, state machine transitions, REST API endpoints, user authentication and database models.", table_cell_style)],
        [Paragraph("Database & Realtime", table_cell_bold), Paragraph("Firebase Realtime Database & SQLite / PostgreSQL", table_cell_style), Paragraph("Instant two-way live sync for active orders, real-time status transitions, OTP security secrets, and persistent relational data storage.", table_cell_style)],
    ]
    p2_tech_table = Table(p2_tech_data, colWidths=[80, 140, usable_width - 220])
    p2_tech_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(p2_tech_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph(
        "<i>This document describes the implemented structure and verified workflows of the FabriCare Laundry Management Platform.</i>",
        note_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: 2. PORTAL STRUCTURE (CUSTOMER & ADMIN)
    # =========================================================================
    story.append(Paragraph("2. Portal Structure and Responsibilities", h1_style))
    story.append(Paragraph(
        "Each portal contains the pages and views required by its specific user role. The folder hierarchies below "
        "show the actual source files and organizational structure across the frontend codebase.",
        body_style
    ))
    story.append(Spacer(1, 2))

    # 2.1 Customer Portal
    story.append(Paragraph("2.1 Customer Portal", sub_h2_style))
    story.append(Paragraph("Folder: frontend/src/customer/", folder_label_style))

    cust_tree = (
        "customer/\n"
        "├── CustomerDashboard.jsx      # Customer overview, active orders, quick actions\n"
        "├── BookingConfirmation.jsx    # Booking receipt and order confirmation view\n"
        "├── MyOrders.jsx               # Active, ongoing, and past order history\n"
        "├── TrackOrder.jsx             # Live visual timeline and order tracking stepper\n"
        "├── SavedAddresses.jsx         # Doorstep pickup & delivery address book\n"
        "├── PaymentsInvoices.jsx       # Order billing, invoice downloads, payment records\n"
        "├── HelpSupport.jsx            # Support ticket creation and FAQs\n"
        "├── CustomerReports.jsx        # Customer complaints and issue reporting\n"
        "├── Notifications.jsx          # Order lifecycle updates and account alerts\n"
        "└── Profile.jsx                # Personal details, phone, and security settings"
    )
    story.append(make_tree_box(cust_tree))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Features", h2_style))
    cust_features = [
        "Select laundry services (Wash & Fold, Dry Cleaning, Steam Press, Premium Fabric Care) with customized garment item quantities.",
        "Choose doorstep pickup address, add landmark details, and select preferred pickup date and time slots.",
        "Track order progress in real time through an interactive visual stepper synced with Firebase Realtime Database.",
        "View detailed itemized bills, pricing breakdown (service total, pickup fee, discounts, taxes), and download PDF invoices.",
        "Manage saved addresses, profile settings, notifications, support tickets, and complaint resolutions."
    ]
    for f in cust_features:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{f}", bullet_style))

    story.append(Spacer(1, 5))

    # 2.2 Admin Portal
    story.append(Paragraph("2.2 Admin Portal", sub_h2_style))
    story.append(Paragraph("Folder: frontend/src/pages/admin/", folder_label_style))

    admin_tree = (
        "admin/\n"
        "├── AdminDashboardPage.jsx     # Live KPIs, order pipeline, revenue stats, hub load\n"
        "├── AdminOrdersPage.jsx        # Comprehensive orders management and status controls\n"
        "├── AdminPickupDeliveryPage.jsx# Pickup and delivery task dispatching and assignment\n"
        "├── AdminCustomersPage.jsx     # Registered customers management and order histories\n"
        "├── AdminUsersPage.jsx         # Laundry staff & delivery agents role management\n"
        "├── AdminServicesPage.jsx      # Laundry services catalog, garment items & pricing\n"
        "├── AdminDeliveryReportsPage.jsx# Delivery performance metrics, completion rates\n"
        "├── AdminComplaintReportsPage.jsx# Customer complaints investigation and rescheduling\n"
        "├── AdminNotificationsPage.jsx # Broadcast alerts and system notifications manager\n"
        "└── AdminSettingsPage.jsx      # Platform configuration, operational hours, hubs"
    )
    story.append(make_tree_box(admin_tree))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Features", h2_style))
    admin_features = [
        "Review new customer orders in real time with quick Accept, Reject, or Reschedule capabilities.",
        "Assign available delivery executives for doorstep customer pickups and final order deliveries.",
        "Manage services catalog, itemized rates, express turnaround fees, and tax calculations.",
        "Monitor operational health: active orders, hub workload, pending pickups, and delayed delivery alerts.",
        "Manage registered users, review staff identity documents (Aadhaar, Driving License, PAN), and audit activity."
    ]
    for f in admin_features:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{f}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: 2.3 LAUNDRY STAFF & 2.4 DELIVERY PORTAL
    # =========================================================================
    story.append(Paragraph("2.3 Laundry Staff Portal", sub_h2_style))
    story.append(Paragraph("Folder: frontend/src/laundry-staff/", folder_label_style))

    laundry_tree = (
        "laundry-staff/\n"
        "├── LaundryPortal.jsx          # Hub staff workspace, stage tabs and modal handlers\n"
        "├── Dashboard.tsx              # Processing queues overview, urgent orders count\n"
        "├── Orders.tsx                 # Processing queues (Washing, Drying, Ironing, Packing)\n"
        "├── OrderDetails.tsx           # Garment breakdown, special wash instructions, notes\n"
        "├── OrderHistory.tsx           # Completed processing batch history and archive\n"
        "├── Notifications.tsx          # Real-time alerts for incoming driver handovers\n"
        "└── taskConfig.js              # Processing stage definitions, colors, and workflows"
    )
    story.append(make_tree_box(laundry_tree))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Features", h2_style))
    laundry_features = [
        "Confirm receipt of clothes from delivery executives at the hub and verify physical item counts against customer order.",
        "Manage stage-by-stage garment processing pipeline: Intake → Washing → Drying → Steam Ironing.",
        "Record Quality Check (QC) inspection results: pass garments to packing or route defective items for rework.",
        "Pack completed garments, generate packaging verification tags, and mark orders as Ready for Delivery.",
        "Track processing stage timestamps and staff accountability for every garment batch."
    ]
    for f in laundry_features:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{f}", bullet_style))

    story.append(Spacer(1, 6))

    # 2.4 Delivery Portal
    story.append(Paragraph("2.4 Delivery Portal", sub_h2_style))
    story.append(Paragraph("Folder: frontend/src/delivery/", folder_label_style))

    deliv_tree = (
        "delivery/\n"
        "├── DeliveryPortal.jsx         # Executive task workspace, OTP verification & modals\n"
        "├── MyPickupTasks.tsx          # Assigned doorstep pickup tasks list with live filters\n"
        "├── PickupDetails.tsx          # Customer address, phone, item count, pickup notes\n"
        "├── PickupConfirmation.tsx     # 4-Digit customer OTP validation, bags count & weight\n"
        "├── LaundryDropOff.tsx         # Handover confirmation at laundry hub\n"
        "├── MyDeliveryTasks.tsx        # Assigned doorstep delivery tasks list\n"
        "├── DeliveryDetails.tsx        # Customer location, payment status, deliver notes\n"
        "├── DeliveryConfirmation.tsx   # Final 4-digit delivery OTP verification & proof\n"
        "├── FailedDeliveries.tsx       # Failed attempt logger with rescheduling reasons\n"
        "└── TaskHistory.tsx            # Completed delivery runs, earnings, and date filters"
    )
    story.append(make_tree_box(deliv_tree))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Features", h2_style))
    deliv_features = [
        "View assigned pickup and delivery tasks with customer details, phone dialer, navigation address, and slot time.",
        "Secure Doorstep Pickup: Verifies customer identity via real 4-digit OTP dispatched to customer email (EmailJS API).",
        "Record collected laundry bags count, approximate weight (kg), and condition notes at customer doorstep.",
        "Confirm safe handover and drop-off of collected garments to laundry hub staff.",
        "Secure Final Delivery: Verifies customer delivery OTP, records recipient name, collects cash/UPI, and saves delivery proof."
    ]
    for f in deliv_features:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{f}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 5: 3. END-TO-END ORDER WORKFLOW
    # =========================================================================
    story.append(Paragraph("3. End-to-End Order Workflow", h1_style))
    story.append(Paragraph(
        "Pickup and final delivery are separate operational tasks, but both remain linked to the same master order record "
        "and order ID, synchronized in real time across all four portals.",
        body_style
    ))
    story.append(Spacer(1, 3))

    workflow_data = [
        [Paragraph("Step", table_header_style), Paragraph("Responsible portal", table_header_style), Paragraph("Action", table_header_style), Paragraph("Example status", table_header_style)],
        [Paragraph("1", table_cell_bold), Paragraph("Customer", table_cell_style), Paragraph("Customer selects services, items, specifies pickup address and time slot, and confirms order.", table_cell_style), Paragraph("PENDING / Order Placed", table_cell_style)],
        [Paragraph("2", table_cell_bold), Paragraph("Admin", table_cell_style), Paragraph("Admin reviews incoming order details and accepts or rejects the order.", table_cell_style), Paragraph("ACCEPTED / REJECTED", table_cell_style)],
        [Paragraph("3", table_cell_bold), Paragraph("Admin &rarr; Delivery", table_cell_style), Paragraph("Admin dispatches and assigns an active delivery partner for customer doorstep pickup.", table_cell_style), Paragraph("PICKUP_ASSIGNED", table_cell_style)],
        [Paragraph("4", table_cell_bold), Paragraph("Delivery", table_cell_style), Paragraph("Partner reaches doorstep, verifies real 4-digit customer OTP sent to email, records bags and weight.", table_cell_style), Paragraph("PICKED_UP", table_cell_style)],
        [Paragraph("5", table_cell_bold), Paragraph("Delivery &rarr; Laundry Staff", table_cell_style), Paragraph("Partner drops garments at laundry hub; staff verifies physical items and confirms receipt.", table_cell_style), Paragraph("AT_HUB / Received at Hub", table_cell_style)],
        [Paragraph("6", table_cell_bold), Paragraph("Laundry Staff", table_cell_style), Paragraph("Staff advances order through washing, drying, and steam ironing stages with live progress.", table_cell_style), Paragraph("IN_PROCESSING (Washing/Drying/Ironing)", table_cell_style)],
        [Paragraph("7", table_cell_bold), Paragraph("Laundry Staff", table_cell_style), Paragraph("Staff conducts quality check inspection, bags items, and marks order ready for dispatch.", table_cell_style), Paragraph("READY_FOR_DELIVERY / Packed", table_cell_style)],
        [Paragraph("8", table_cell_bold), Paragraph("Admin / System &rarr;<br/>Delivery", table_cell_style), Paragraph("Admin assigns a delivery executive to transport packed clothes from hub to customer.", table_cell_style), Paragraph("OUT_FOR_DELIVERY", table_cell_style)],
        [Paragraph("9", table_cell_bold), Paragraph("Delivery", table_cell_style), Paragraph("Partner delivers clean clothes at doorstep, verifies 4-digit delivery OTP, and collects payment.", table_cell_style), Paragraph("DELIVERED / Completed", table_cell_style)],
    ]
    wf_table = Table(workflow_data, colWidths=[30, 115, usable_width - 255, 110])
    wf_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(wf_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Exception handling", h2_style))
    exceptions = [
        "Rejected orders do not proceed to pickup; customer is notified instantly with rejection reason.",
        "Failed pickup or delivery attempts (e.g. customer unavailable, wrong address) are recorded with failure reasons and automatically queued for Admin rescheduling.",
        "Garments failing quality check inspection are returned to Rework stage with issue comments rather than being packed.",
        "Every status transition automatically records timestamp, responsible user ID, and updates Firebase Realtime Database for zero-latency client sync."
    ]
    for ex in exceptions:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{ex}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 6: 4. TECHNICAL ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("4. Technical Architecture", h1_style))
    story.append(Paragraph(
        "The FabriCare architecture combines a reactive React 18 frontend, Django 5.1 REST Framework for backend "
        "business logic, and Firebase Realtime Database for live cross-portal event synchronization.",
        body_style
    ))
    story.append(Spacer(1, 2))

    arch_layers = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology", table_header_style), Paragraph("Responsibility", table_header_style)],
        [Paragraph("Frontend", table_cell_bold), Paragraph("React 18 · Vite 6 · Tailwind CSS · Context API", table_cell_style), Paragraph("Single Page Application (SPA), role-based routing, real-time tracking views, modal dialogs, and responsive layout.", table_cell_style)],
        [Paragraph("Backend", table_cell_bold), Paragraph("Django 5.1 · Django REST Framework · SimpleJWT", table_cell_style), Paragraph("Authoritative business rules, permissions validation, user management, order state machine, and RESTful APIs.", table_cell_style)],
        [Paragraph("Database & Realtime", table_cell_bold), Paragraph("Firebase Realtime Database & SQLite / PostgreSQL", table_cell_style), Paragraph("High-speed live order synchronization, active delivery task status events, security secrets (OTPs), and relational persistence.", table_cell_style)],
        [Paragraph("External Services", table_cell_bold), Paragraph("EmailJS REST API · Firebase Storage", table_cell_style), Paragraph("Automated delivery of real 4-digit customer verification OTPs directly to inbox, and cloud storage for delivery/agent photos.", table_cell_style)],
    ]
    arch_table = Table(arch_layers, colWidths=[80, 140, usable_width - 220])
    arch_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("Database connection & Real-Time Sync", h2_style))
    story.append(Paragraph(
        "Django connects to the relational database (SQLite in development, PostgreSQL in production) through backend environment variables. "
        "Simultaneously, Firebase Realtime Database synchronizes state changes across active browser clients instantaneously without polling.",
        body_style
    ))
    story.append(Spacer(1, 3))

    story.append(Paragraph("Security principles", h2_style))
    sec_principles = [
        "Store sensitive credentials (Firebase Admin keys, JWT secret keys, EmailJS tokens) strictly in backend and frontend .env files.",
        "Enforce strict Role-Based Access Control (RBAC) on the backend using Django permissions and custom JWT claims.",
        "Secure doorstep pickup and delivery handovers using real 4-digit OTPs generated securely and dispatched directly to customer email.",
        "Never expose privileged administrative database keys or service credentials in client-side bundles."
    ]
    for sp in sec_principles:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{sp}", bullet_style))

    story.append(Spacer(1, 5))

    story.append(Paragraph("Actual backend and frontend codebase structure", h2_style))
    struct_tree = (
        "FabriCare/\n"
        "├── backend/\n"
        "│   ├── manage.py\n"
        "│   ├── db.sqlite3\n"
        "│   ├── .env\n"
        "│   ├── config/\n"
        "│   │   ├── settings/ (base.py, dev.py, prod.py)\n"
        "│   │   ├── urls.py\n"
        "│   │   └── wsgi.py\n"
        "│   └── apps/\n"
        "│       ├── core/ (models, serializers, views, admin)\n"
        "│       └── users/ (models, authentication, serializers, views)\n"
        "└── frontend/\n"
        "    ├── package.json\n"
        "    ├── vite.config.js\n"
        "    ├── .env\n"
        "    └── src/\n"
        "        ├── api/ (apiClient.js)\n"
        "        ├── config/ (firebase.js)\n"
        "        ├── context/ (AuthContext, AdminContext, BookingContext)\n"
        "        ├── customer/ (Dashboard, MyOrders, TrackOrder, Booking)\n"
        "        ├── pages/admin/ (Dashboard, Orders, Dispatch, Users, Services)\n"
        "        ├── laundry-staff/ (LaundryPortal, Orders, taskConfig)\n"
        "        ├── delivery/ (DeliveryPortal, MyPickupTasks, TaskHistory)\n"
        "        └── services/ (otpEmailService, firestoreService, authService)"
    )
    story.append(make_tree_box(struct_tree))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 7: 5. CORE DATA ENTITIES & 6. API AND TRACKING
    # =========================================================================
    story.append(Paragraph("5. Core Data Entities", h1_style))

    entities_data = [
        [Paragraph("Entity", table_header_style), Paragraph("Purpose in Project Codebase (apps.core & apps.users)", table_header_style)],
        [Paragraph("User & Role", table_cell_bold), Paragraph("Custom user model supporting 4 distinct roles: CUSTOMER, ADMIN, LAUNDRY_STAFF, and DELIVERY_STAFF.", table_cell_style)],
        [Paragraph("CustomerAddress", table_cell_bold), Paragraph("Doorstep pickup & delivery locations with flat/house, area/colony, city, and pincode.", table_cell_style)],
        [Paragraph("ServiceCategory", table_cell_bold), Paragraph("Top-level laundry categories: Wash & Fold, Dry Cleaning, Steam Press, Premium Care.", table_cell_style)],
        [Paragraph("Service", table_cell_bold), Paragraph("Specific laundry items and garment types with standard prices, unit metrics, and turnaround times.", table_cell_style)],
        [Paragraph("Order & OrderItem", table_cell_bold), Paragraph("Master order record linking customer, selected garments, quantities, total amount, and status.", table_cell_style)],
        [Paragraph("PickupRecord", table_cell_bold), Paragraph("Driver pickup confirmation capturing collected bag count, weight (kg), and verified customer OTP.", table_cell_style)],
        [Paragraph("LaundryHandoverRecord", table_cell_bold), Paragraph("Hub intake record documenting garment receipt verification between delivery driver and hub staff.", table_cell_style)],
        [Paragraph("LaundryStageLog", table_cell_bold), Paragraph("Real-time timestamp log for Washing, Drying, and Steam Ironing processing stages.", table_cell_style)],
        [Paragraph("DeliveryRecord", table_cell_bold), Paragraph("Final delivery log recording recipient name, doorstep delivery OTP verification, and payment proof.", table_cell_style)],
        [Paragraph("Invoice", table_cell_bold), Paragraph("Financial record containing subtotal, tax amount, delivery charges, discounts, and payment method.", table_cell_style)],
        [Paragraph("Notification & SupportTicket", table_cell_bold), Paragraph("In-app notifications and customer support / complaint tickets with status resolution tracking.", table_cell_style)],
    ]
    ent_table = Table(entities_data, colWidths=[130, usable_width - 130])
    ent_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 3.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.8),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(ent_table)
    story.append(Spacer(1, 6))

    # 6. API and Tracking Approach
    story.append(Paragraph("6. API and Tracking Approach", h1_style))
    story.append(Paragraph(
        "The following are the active versioned REST API endpoints implemented in backend/config/urls.py.",
        body_style
    ))
    story.append(Spacer(1, 2))

    api_data = [
        [Paragraph("Area", table_header_style), Paragraph("API Endpoint", table_header_style), Paragraph("Operational Purpose", table_header_style)],
        [Paragraph("Authentication", table_cell_bold), Paragraph("/api/v1/auth/login/<br/>/api/v1/auth/register/<br/>/api/v1/auth/me/", table_cell_style), Paragraph("User authentication, JWT token issuance, session refresh, and profile retrieval.", table_cell_style)],
        [Paragraph("Services Catalog", table_cell_bold), Paragraph("/api/v1/services/<br/>/api/v1/services/categories/", table_cell_style), Paragraph("Retrieve active laundry categories, garment items, base prices, and express rates.", table_cell_style)],
        [Paragraph("Orders", table_cell_bold), Paragraph("/api/v1/orders/<br/>/api/v1/customer/orders/", table_cell_style), Paragraph("Create orders, list authorized customer orders, and retrieve order details.", table_cell_style)],
        [Paragraph("Admin Dispatch", table_cell_bold), Paragraph("/api/v1/admin/orders/{id}/accept/<br/>/api/v1/admin/orders/{id}/assign-staff/", table_cell_style), Paragraph("Admin order review, acceptance/rejection, and delivery agent assignment.", table_cell_style)],
        [Paragraph("Delivery Tasks", table_cell_bold), Paragraph("/api/v1/delivery/tasks/<br/>/api/v1/delivery/tasks/{id}/confirm-pickup/<br/>/api/v1/delivery/tasks/{id}/confirm-delivery/", table_cell_style), Paragraph("Fetch driver task queue, verify customer pickup OTP, log drop-off, and confirm final delivery.", table_cell_style)],
        [Paragraph("Laundry Processing", table_cell_bold), Paragraph("/api/v1/laundry/orders/<br/>/api/v1/laundry/orders/{id}/advance-stage/<br/>/api/v1/laundry/orders/{id}/quality-check/", table_cell_style), Paragraph("Hub intake confirmation, advance washing/drying/ironing stages, and record QC check results.", table_cell_style)],
        [Paragraph("Tracking & Alerts", table_cell_bold), Paragraph("/api/v1/orders/{id}/history/<br/>/api/v1/notifications/<br/>/api/v1/support/", table_cell_style), Paragraph("Fetch chronological order transition history, user notifications, and support tickets.", table_cell_style)],
    ]
    api_table = Table(api_data, colWidths=[90, 180, usable_width - 270])
    api_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 3.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.8),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("Tracking rules", h2_style))
    track_rules = [
        "Backend validates every status transition against an authoritative state machine before writing to the database.",
        "Valid state changes update the relational database and simultaneously broadcast to Firebase Realtime Database.",
        "Customer Track Order page listens directly to Firebase nodes for instant, real-time UI updates without polling.",
        "Failed quality checks automatically route orders to Rework status with mandatory staff inspection notes.",
        "Doorstep pickup and delivery events strictly require 4-digit OTP verification matching the database record."
    ]
    for tr in track_rules:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{tr}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 8: 7. IMPLEMENTATION PLAN & CHECKLIST
    # =========================================================================
    story.append(Paragraph("7. Implementation Plan", h1_style))

    plan_data = [
        [Paragraph("Phase", table_header_style), Paragraph("Focus", table_header_style), Paragraph("Expected outcome", table_header_style)],
        [Paragraph("1 — Foundation & Auth", table_cell_bold), Paragraph("Django 5.1 project setup, Custom User model, JWT authentication, Firebase SDK integration, React Vite setup.", table_cell_style), Paragraph("Secure base authentication, RBAC authorization, and multi-portal routing.", table_cell_style)],
        [Paragraph("2 — Catalog & Booking", table_cell_bold), Paragraph("Services categories, garment items, multi-step booking wizard, address book, and price calculations.", table_cell_style), Paragraph("Customers can select items, configure addresses, and submit orders.", table_cell_style)],
        [Paragraph("3 — Admin & Dispatch", table_cell_bold), Paragraph("Live operational dashboard, pending orders queue, Accept/Reject controls, and automated driver dispatch.", table_cell_style), Paragraph("Admins can review orders, assign delivery staff, and monitor hub metrics.", table_cell_style)],
        [Paragraph("4 — Doorstep Pickup & OTP", table_cell_bold), Paragraph("Delivery tasks feed, EmailJS real 4-digit OTP dispatch, bag count logging, approximate weight and hub drop-off.", table_cell_style), Paragraph("Secure doorstep pickup with real customer OTP verification and hub handover.", table_cell_style)],
        [Paragraph("5 — Hub Processing & QC", table_cell_bold), Paragraph("Hub intake verification, stage advancing (Washing, Drying, Ironing), QC pass/rework routing, and packing.", table_cell_style), Paragraph("Full transparency into laundry cleaning stages and quality verification.", table_cell_style)],
        [Paragraph("6 — Delivery & Verification", table_cell_bold), Paragraph("Out for delivery dispatch, delivery OTP validation, cash/UPI collection, and multi-portal live sync.", table_cell_style), Paragraph("Completed end-to-end order lifecycle verified across all four portals.", table_cell_style)],
    ]
    plan_table = Table(plan_data, colWidths=[95, 230, usable_width - 325])
    plan_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, C_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.4, C_BORDER),
        ('BACKGROUND', (0, 0), (-1, 0), C_HEADER_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 4.2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.2),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(plan_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("End-to-end verification checklist", h2_style))
    checklist = [
        "A customer can place an order and see it immediately in Customer Dashboard and My Orders.",
        "The admin reviews new orders; rejected orders are canceled, and accepted orders can be assigned for pickup.",
        "Only the assigned delivery partner sees the task, navigates to customer, and enters the real 4-digit OTP sent to customer email.",
        "Pickup confirmation records bag count, approximate weight (kg), and confirms safe handover at the laundry hub.",
        "Laundry staff verifies intake, advances stages (Washing, Drying, Ironing), and passes quality check inspection.",
        "Completed garments are packed, tagged, and marked Ready for Delivery.",
        "Delivery partner delivers clean clothes at customer doorstep and verifies the delivery OTP.",
        "The customer visualizer reflects all status updates in real time via Firebase Realtime Database without page refresh.",
        "Role permissions, token authentication, and API endpoints are strictly tested and verified."
    ]
    for chk in checklist:
        story.append(Paragraph(f"&bull;&nbsp;&nbsp;{chk}", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Final note", h2_style))
    story.append(Paragraph(
        "This document defines the verified system architecture, real codebase components, and recommended workflows "
        "for FabriCare. Before adding new features or migrations, verify existing endpoints and database models in apps.core "
        "and apps.users to preserve data integrity.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Bottom Prepared By note
    footer_note = ParagraphStyle(
        'DocFootNote',
        parent=styles['Normal'],
        fontName=F_ITALIC,
        fontSize=8.5,
        leading=12,
        textColor=C_MUTED
    )
    story.append(Paragraph(
        "Prepared by Pratiksha Harode, Priyanka Kushwah · Software Development Team · 10.11.2026",
        footer_note
    ))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Document successfully created: {filename}")


if __name__ == "__main__":
    build_pdf()
