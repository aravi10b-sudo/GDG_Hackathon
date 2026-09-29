export const t = {
  en: {
    // Header & Brand
    app_title: 'JanVikas Setu',
    app_subtitle: 'National Citizen Infrastructure & Demand Intelligence',
    emblem_text: 'GOVERNMENT OF INDIA · DIGITAL PUBLIC GOOD',
    state_subtitle: 'National Development Corridors',
    portal_citizen: 'Citizen Voice & Intake Portal',
    portal_policymaker: 'Policymaker Spatial Intelligence',
    lang_toggle: 'தமிழ்',
    live_badge: 'LIVE DPI PLATFORM',

    // Citizen Portal
    citizen_hero_title: 'Direct Infrastructure Voice for Every Citizen',
    citizen_hero_desc: 'Submit local infrastructure deficits in Tamil, English, or Tanglish via voice note, WhatsApp, or web form. Aggregated directly to national PM GatiShakti & state planning boards.',
    tab_voice: 'Voice Note Submission',
    tab_whatsapp: 'WhatsApp Simulator',
    tab_webform: 'Structured Web Grievance',
    
    // Voice Recorder
    voice_heading: 'Speak Your Local Infrastructure Grievance',
    voice_subheading: 'Record in Tamil (தமிழ்), English, or Tanglish. Our AI listens, transcribes, and normalizes into official project requirements.',
    mic_start: 'Tap to Record Voice Note',
    mic_recording: 'Listening... (Speak in Tamil / English)',
    mic_stop: 'Stop & Submit Voice Note',
    mic_analyzing: 'Gemini AI is analyzing audio transcript...',
    mic_sample_prompts: 'Try speaking or click a sample voice query:',
    sample_voice_1: 'எங்க மதுர மேலூர் மெயின் ரோட்ல குடிநீர் பைப் உடைஞ்சு 15 நாளா தண்ணி இல்லாம மக்கள் கஷ்டப்படுறோம்.',
    sample_voice_2: 'Dharmapuri tribal hill village road is completely washed out, ambulances cannot reach the primary healthcare centre.',
    sample_voice_3: 'ராமநாதபுரம் கடலோர பகுதியில் ஆழ்துளை கிணறுகளில் உப்புத்தண்ணீர் வருகிறது, குடிநீர் திட்டத்தை விரிவுபடுத்துங்கள்.',
    
    // WhatsApp Simulator
    wa_header_title: 'JanVikas Setu Official Bot',
    wa_header_status: 'Online · Citizen Grievance Gateway',
    wa_type_placeholder: 'Type message in Tamil or English...',
    wa_send: 'Send',
    wa_record_btn: 'Voice',
    wa_preset_1: 'எங்கள் கிராமத்தில் சாலை போட வேண்டும்',
    wa_preset_2: 'PHC hospital needs regular doctor & medicine',
    wa_preset_3: 'தண்ணீர் வசதி இல்லை, குடிநீர் பற்றாக்குறை',
    
    // Grievance Form
    form_heading: 'Detailed Public Works Grievance Form',
    field_district: 'District',
    field_taluk: 'Taluk / Gram Panchayat',
    field_category: 'Infrastructure Sector',
    field_description: 'Describe the infrastructure problem in detail',
    field_description_placeholder: 'E.g., 3km road connecting village to bus route has deep craters. 4,000 residents affected...',
    field_urgency: 'Severity / Urgency',
    field_contact: 'Citizen Contact (Optional for SMS updates)',
    btn_submit_grievance: 'Submit & Generate Official Tracking ID',
    submitting: 'Processing submission with Gemini AI...',
    
    // Community Feed
    community_feed_title: 'Community Verified Grievances & Upvote Feed',
    community_feed_desc: 'Grievances with more community upvotes are automatically elevated to higher prioritization weight in district capex planning.',
    upvote_btn: 'I Also Face This Issue',
    upvoted_btn: 'Acknowledged (+1 Impact)',
    filter_all: 'All Sectors',
    search_placeholder: 'Search grievances by district, village, or keyword...',
    
    // Ticket Receipt
    receipt_title: 'Official Citizen Grievance Acknowledgement',
    receipt_tracking_label: 'National Tracking Code',
    receipt_sla_label: 'Statutory Resolution SLA',
    receipt_sla_val: '14 Working Days (District Collectorate Oversight)',
    receipt_qr_sub: 'Scan to track live status on JanVikas Setu Portal',
    receipt_close: 'Done / Track Another Issue',
    receipt_print: 'Download / Print Receipt',

    // Policymaker Portal
    policy_hero_title: 'State Infrastructure Demand & Capex Intelligence',
    policy_hero_desc: 'Spatial synthesis of citizen voice demands combined with infrastructure deficit indices (NFHS, Census, PMGSY, JJM). Identify hotspots and generate cabinet-ready DPRs.',
    export_report_btn: 'Export Report',
    export_report_sub: 'Downloadable CSV of hotspots & deficit indices',
    export_report_success: 'Report downloaded successfully',
    
    // KPI Cards
    kpi_total_tickets: 'Total Citizen Grievances',
    kpi_total_tickets_sub: 'Aggregated via Voice, WhatsApp & Web',
    kpi_mismatch_rate: 'Capex Alignment Gap',
    kpi_mismatch_rate_sub: 'Budgets misaligned with citizen priority',
    kpi_high_deficit_panchayats: 'High-Deficit Panchayats',
    kpi_high_deficit_sub: 'Urgent infrastructure deficit index > 70',
    kpi_sanctioned_capex: 'Citizen-Aligned Pipeline',
    kpi_sanctioned_sub: 'Active interventions ready for sanction',
    
    // Map & Heatmap
    map_section_title: 'Spatial Infrastructure Demand & Deficit Heatmap',
    map_legend_low: 'Low Deficit (<40)',
    map_legend_mid: 'Moderate (40-69)',
    map_legend_high: 'Critical Deficit (>70)',
    map_select_sector: 'Filter Sector Heatmap:',
    district_drawer_title: 'District Infrastructure Dossier',
    view_details: 'Inspect District Dossier',
    close_drawer: 'Close Dossier',
    
    // Hotspots & Clusters
    hotspots_title: 'AI Systemic Demand Hotspots',
    hotspots_desc: 'Unsupervised clustering of thousands of citizen voice notes identifying multi-village systemic bottlenecks.',
    cluster_affected: 'Est. Population Impacted',
    cluster_urgency: 'Demand Urgency',
    
    // Prioritization Matrix
    matrix_title: 'Gemini Multi-Criteria Project Prioritization Engine',
    matrix_desc: 'Algorithmically ranks public works pipeline against live citizen demand (40%), deficit severity (30%), socio-economic ROI (20%), and readiness (10%).',
    btn_run_prioritization: 'Re-Analyze Pipeline with Gemini AI',
    analyzing_pipeline: 'Calculating multi-criteria equity matrix...',
    col_project: 'Proposed Capital Project',
    col_district: 'District',
    col_budget: 'Budget (₹ Cr)',
    col_score: 'Impact Priority',
    col_tier: 'Cabinet Action',
    col_action: 'Detailed Memo',
    btn_generate_dpr: 'Generate Cabinet DPR',
    
    // DPR Modal
    dpr_modal_title: 'Cabinet-Ready Detailed Project Report (DPR) Executive Memo',
    dpr_modal_sub: 'Automated synthesis combining citizen demand evidence with public investment metrics for cabinet sanction.',
    dpr_generating: 'Drafting bilingual cabinet memorandum with Gemini AI...',
    dpr_print_btn: 'Print Official Memorandum',
    dpr_copy_btn: 'Copy DPR Text',
    dpr_close_btn: 'Close Memorandum',

    // Categories
    cat_water: 'Water & Sanitation (JJM)',
    cat_roads: 'Rural Roads & Highways (PMGSY)',
    cat_power: 'Power & Street Lighting',
    cat_health: 'Primary Healthcare (PM-ABHIM)',
    cat_education: 'School & College Infrastructure',
    cat_sanitation: 'Drainage & Waste Management',
    cat_transport: 'Public Bus & Transit Connectivity',
    cat_other: 'Civic Infrastructure',

    // Severities
    sev_critical: 'Critical (P1)',
    sev_high: 'High (P2)',
    sev_medium: 'Moderate (P3)',
    sev_low: 'Minor (P4)',
  },
  ta: {
    // Header & Brand
    app_title: 'ஜன்விகாஸ் சேது',
    app_subtitle: 'தேசிய குடிமக்கள் உள்கட்டமைப்பு மற்றும் தேவை நுண்ணறிவு தளம்',
    emblem_text: 'இந்திய அரசு · டிஜிட்டல் பொது நன்மை (DPG)',
    state_subtitle: 'தேசிய மேம்பாட்டுப் பெருவழிகள்',
    portal_citizen: 'குடிமக்கள் குரல் மற்றும் கோரிக்கை தளம்',
    portal_policymaker: 'கொள்கை வகுப்பாளர் நிலப்பரப்பு நுண்ணறிவு',
    lang_toggle: 'हिन्दी',
    live_badge: 'நேரலை தளம் (DPI)',

    // Citizen Portal
    citizen_hero_title: 'ஒவ்வொரு குடிமகனுக்கும் நேரடி உள்கட்டமைப்பு குரல்',
    citizen_hero_desc: 'உங்கள் பகுதி சாலை, குடிநீர், மின்சாரம் மற்றும் மருத்துவ தேவைகளை தமிழ் அல்லது ஆங்கிலத்தில் குரல் பதிவு, வாட்ஸ்அப் அல்லது இணையதளம் மூலம் தெரிவிக்கவும். இது நேரடியாக அரசின் திட்டமிடல் வரைபடங்களில் இணைக்கப்படுகிறது.',
    tab_voice: 'குரல் பதிவு வழி கோரிக்கை',
    tab_whatsapp: 'வாட்ஸ்அப் (WhatsApp) முறை',
    tab_webform: 'விரிவான படிவம்',

    // Voice Recorder
    voice_heading: 'உங்கள் பகுதி உள்கட்டமைப்பு குறையை பேசுங்கள்',
    voice_subheading: 'தமிழில் தெளிவாகப் பேசலாம். எமது AI குரலை உணர்ந்து தானாகவே அதிகாரப்பூர்வ அரசு உள்கட்டமைப்பு கோரிக்கையாக மாற்றும்.',
    mic_start: 'பேசத் தொடங்கவும் (மைக்)',
    mic_recording: 'கேட்கிறது... (தமிழில் பேசவும்)',
    mic_stop: 'பேசி முடித்ததும் அழுத்தவும்',
    mic_analyzing: 'Gemini AI உங்கள் குரலை ஆராய்கிறது...',
    mic_sample_prompts: 'நீங்களே பேசலாம் அல்லது மாதிரி குரல் பதிவை கிளிக் செய்யலாம்:',
    sample_voice_1: 'எங்க மதுர மேலூர் மெயின் ரோட்ல குடிநீர் பைப் உடைஞ்சு 15 நாளா தண்ணி இல்லாம மக்கள் கஷ்டப்படுறோம்.',
    sample_voice_2: 'Dharmapuri tribal hill village road is completely washed out, ambulances cannot reach the primary healthcare centre.',
    sample_voice_3: 'ராமநாதபுரம் கடலோர பகுதியில் ஆழ்துளை கிணறுகளில் உப்புத்தண்ணீர் வருகிறது, குடிநீர் திட்டத்தை விரிவுபடுத்துங்கள்.',

    // WhatsApp Simulator
    wa_header_title: 'ஜன்விகாஸ் சேது வாட்ஸ்அப் சேவை',
    wa_header_status: 'ஆன்லைன் · குடிமக்கள் குறைதீர்ப்பு சேவை',
    wa_type_placeholder: 'தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யவும்...',
    wa_send: 'அனுப்பு',
    wa_record_btn: 'குரல்',
    wa_preset_1: 'எங்கள் கிராமத்தில் சாலை போட வேண்டும்',
    wa_preset_2: 'PHC அரசு மருத்துவமனைக்கு மருத்துவர் தேவை',
    wa_preset_3: 'தண்ணீர் வசதி இல்லை, குடிநீர் பற்றாக்குறை',

    // Grievance Form
    form_heading: 'விரிவான உள்கட்டமைப்பு குறைதீர்ப்பு படிவம்',
    field_district: 'மாவட்டம்',
    field_taluk: 'வட்டம் / கிராம ஊராட்சி',
    field_category: 'உள்கட்டமைப்பு துறை',
    field_description: 'பிரச்சனையை விரிவாக விளக்குங்கள்',
    field_description_placeholder: 'எ.கா: கிராமத்திற்கு செல்லும் 3 கி.மீ சாலை குண்டும் குழியுமாக உள்ளது. 4,000 மக்கள் பாதிக்கப்பட்டுள்ளனர்...',
    field_urgency: 'அவசர நிலை',
    field_contact: 'தொடர்பு எண் (SMS தகவல் பெற)',
    btn_submit_grievance: 'கோரிக்கையை பதிவு செய்து கண்காணிப்பு எண் பெறுக',
    submitting: 'Gemini AI மூலம் கோரிக்கை பதிவு செய்யப்படுகிறது...',

    // Community Feed
    community_feed_title: 'மக்கள் சரிபார்த்த கோரிக்கைகள் மற்றும் ஆதரவு தளம்',
    community_feed_desc: 'அதிக மக்களின் ஆதரவு (+1) பெறும் கோரிக்கைகளுக்கு மாவட்ட நிதி ஒதுக்கீட்டில் கூடுதல் முன்னுரிமை வழங்கப்படும்.',
    upvote_btn: 'எனக்கும் இதே பிரச்சனை உள்ளது (+1)',
    upvoted_btn: 'ஆதரவு பதிவு செய்யப்பட்டது (+1)',
    filter_all: 'அனைத்து துறைகளும்',
    search_placeholder: 'மாவட்டம், கிராமம் அல்லது முக்கிய வார்த்தை கொண்டு தேடவும்...',

    // Ticket Receipt
    receipt_title: 'குடிமக்கள் குறைதீர்ப்பு அதிகாரப்பூர்வ ஒப்புகைச் சீட்டு',
    receipt_tracking_label: 'தேசிய கண்காணிப்பு குறியீடு',
    receipt_sla_label: 'சட்டரீதியான தீர்வு காலக்கெடு',
    receipt_sla_val: '14 வேலை நாட்கள் (மாவட்ட ஆட்சியர் கண்காணிப்பு)',
    receipt_qr_sub: 'ஜன்விகாஸ் சேது தளத்தில் நேரலை நிலை அறிய ஸ்கேன் செய்க',
    receipt_close: 'முடிந்தது / மற்றொரு கோரிக்கை பதிவு செய்க',
    receipt_print: 'ஒப்புகைச் சீட்டை அச்சிடுக / பதிவிறக்குக',

    // Policymaker Portal
    policy_hero_title: 'மாநில உள்கட்டமைப்பு தேவை & நிதி ஒதுக்கீடு நுண்ணறிவு',
    policy_hero_desc: 'குடிமக்களின் குரல் கோரிக்கைகள் மற்றும் உள்கட்டமைப்பு பற்றாக்குறை குறியீடுகளின் தொகுப்பு. அதிக தேவை உள்ள பகுதிகளைக் கண்டறிந்து அமைச்சரவை ஒப்புதல் குறிப்புகளை உடனடியாக உருவாக்கலாம்.',
    export_report_btn: 'அறிக்கை பதிவிறக்கம் (Export Report)',
    export_report_sub: 'மாவட்ட பற்றாக்குறை மற்றும் மக்கள் தேவை CSV அறிக்கை',
    export_report_success: 'அறிக்கை வெற்றிகரமாக பதிவிறக்கப்பட்டது',

    // KPI Cards
    kpi_total_tickets: 'மொத்த மக்கள் கோரிக்கைகள்',
    kpi_total_tickets_sub: 'குரல், வாட்ஸ்அப் மற்றும் இணையவழி பெறப்பட்டவை',
    kpi_mismatch_rate: 'நிதி ஒதுக்கீடு இடைவெளி',
    kpi_mismatch_rate_sub: 'மக்கள் தேவைக்கும் திட்ட நிதிக்கும் உள்ள மாறுபாடு',
    kpi_high_deficit_panchayats: 'அதிதீவிர பற்றாக்குறை ஊராட்சிகள்',
    kpi_high_deficit_sub: 'பற்றாக்குறை குறியீடு > 70 உள்ள பகுதிகள்',
    kpi_sanctioned_capex: 'முன்னுரிமை திட்ட வரிசை',
    kpi_sanctioned_sub: 'அமைச்சரவை ஒப்புதலுக்கு தயாரான திட்டங்கள்',

    // Map & Heatmap
    map_section_title: 'மாவட்ட உள்கட்டமைப்பு பற்றாக்குறை வரைபடம்',
    map_legend_low: 'குறைந்த பற்றாக்குறை (<40)',
    map_legend_mid: 'நடுத்தர பற்றாக்குறை (40-69)',
    map_legend_high: 'அதிதீவிர பற்றாக்குறை (>70)',
    map_select_sector: 'துறை வாரியான வெப்ப வரைபடம்:',
    district_drawer_title: 'மாவட்ட உள்கட்டமைப்பு ஆவணம்',
    view_details: 'மாவட்ட விபரங்களைப் பார்க்கவும்',
    close_drawer: 'மூடுக',

    // Hotspots & Clusters
    hotspots_title: 'AI கண்டறிந்த மக்கள் தேவை மையங்கள்',
    hotspots_desc: 'ஆயிரக்கணக்கான குடிமக்களின் குரல் பதிவுகளிலிருந்து தானாகவே உருவாக்கப்பட்ட பல கிராம உள்கட்டமைப்பு சிக்கல்கள்.',
    cluster_affected: 'பாதிக்கப்பட்ட உத்தேச மக்கள் தொகை',
    cluster_urgency: 'அவசர நிலை',

    // Prioritization Matrix
    matrix_title: 'Gemini பல-அளவுகோல் திட்ட முன்னுரிமை எஞ்சின்',
    matrix_desc: 'மக்கள் தேவை (40%), பற்றாக்குறை தீவிரம் (30%), சமூக-பொருளாதார நன்மை (20%), மற்றும் சாத்தியக்கூறு (10%) அடிப்படையில் திட்டங்களை வரிசைப்படுத்துகிறது.',
    btn_run_prioritization: 'Gemini AI மூலம் திட்டங்களை மறுமதிப்பீடு செய்க',
    analyzing_pipeline: 'பல்துறை முன்னுரிமை கணிப்பு நடைபெறுகிறது...',
    col_project: 'பரிந்துரைக்கப்பட்ட உள்கட்டமைப்பு திட்டம்',
    col_district: 'மாவட்டம்',
    col_budget: 'மதிப்பீடு (₹ கோடி)',
    col_score: 'முன்னுரிமை புள்ளி',
    col_tier: 'அமைச்சரவை நடவடிக்கை',
    col_action: 'அறிக்கை',
    btn_generate_dpr: 'அமைச்சரவை DPR குறிப்பு',

    // DPR Modal
    dpr_modal_title: 'அமைச்சரவை ஒப்புதலுக்கான விரிவான திட்ட அறிக்கை (DPR)',
    dpr_modal_sub: 'குடிமக்கள் தேவை ஆதாரங்கள் மற்றும் அரசு முதலீட்டு காரணங்களை ஒருங்கிணைக்கும் அதிகாரப்பூர்வ அறிக்கை.',
    dpr_generating: 'Gemini AI மூலம் இருமொழி அமைச்சரவை அறிக்கை உருவாக்கப்படுகிறது...',
    dpr_print_btn: 'அதிகாரப்பூர்வ குறிப்பை அச்சிடுக',
    dpr_copy_btn: 'உரையை நகலெடு',
    dpr_close_btn: 'மூடுக',

    // Categories
    cat_water: 'குடிநீர் & தூய்மை (JJM)',
    cat_roads: 'கிராமப்புற சாலைகள் & நெடுஞ்சாலைகள் (PMGSY)',
    cat_power: 'மின்சாரம் & தெருவிளக்குகள்',
    cat_health: 'ஆரம்ப சுகாதாரம் (PM-ABHIM)',
    cat_education: 'பள்ளி & கல்லூரி கட்டமைப்பு',
    cat_sanitation: 'சாக்கடை & கழிவு மேலாண்மை',
    cat_transport: 'பேருந்து & போக்குவரத்து இணைப்பு',
    cat_other: 'பொது உள்கட்டமைப்பு',

    // Severities
    sev_critical: 'அதிமுக்கியம் (P1)',
    sev_high: 'முக்கியம் (P2)',
    sev_medium: 'நடுத்தரம் (P3)',
    sev_low: 'சாதாரண (P4)',
  },
  hi: {
    // Header & Brand
    app_title: 'जनविकास सेतु',
    app_subtitle: 'राष्ट्रीय नागरिक अवसंरचना एवं मांग बुद्धिमत्ता',
    emblem_text: 'भारत सरकार · डिजिटल पब्लिक गुड',
    state_subtitle: 'राष्ट्रीय विकास गलियारे',
    portal_citizen: 'नागरिक आवाज़ एवं इनटेक पोर्टल',
    portal_policymaker: 'नीति निर्माता स्थानिक बुद्धिमत्ता',
    lang_toggle: 'English',
    live_badge: 'लाइव डीपीआई प्लेटफ़ॉर्म',

    // Citizen Portal
    citizen_hero_title: 'हर नागरिक के लिए सीधी अवसंरचना आवाज़',
    citizen_hero_desc: 'स्थानीय अवसंरचना की कमियों को तमिल, अंग्रेज़ी या टंग्लिश में वॉइस नोट, व्हाट्सएप या वेब फ़ॉर्म के माध्यम से दर्ज करें। सीधे राष्ट्रीय पीएम गतिशक्ति एवं राज्य योजना बोर्डों को भेजा जाता है।',
    tab_voice: 'वॉइस नोट सबमिशन',
    tab_whatsapp: 'व्हाट्सएप सिम्युलेटर',
    tab_webform: 'विस्तृत वेब शिकायत',

    // Voice Recorder
    voice_heading: 'अपनी स्थानीय अवसंरचना शिकायत बोलें',
    voice_subheading: 'तमिल (தமிழ்), अंग्रेज़ी, या टंग्लिश में रिकॉर्ड करें। हमारा एआई सुनता है, ट्रांसक्राइब करता है, और आधिकारिक परियोजना आवश्यकताओं में बदलता है।',
    mic_start: 'वॉइस नोट रिकॉर्ड करने के लिए टैप करें',
    mic_recording: 'सुन रहा है... (तमिल / अंग्रेज़ी में बोलें)',
    mic_stop: 'रोकें और वॉइस नोट सबमिट करें',
    mic_analyzing: 'जेमिनी एआई ऑडियो ट्रांसक्रिप्ट का विश्लेषण कर रहा है...',
    mic_sample_prompts: 'बोलकर आज़माएँ या एक नमूना वॉइस क्वेरी पर क्लिक करें:',
    sample_voice_1: 'हमारे गांव में मुख्य सड़क पर पिछले 15 दिनों से पानी की पाइपलाइन फट गई है, लोग बहुत परेशान हैं।',
    sample_voice_2: 'Dharmapuri tribal hill village road is completely washed out, ambulances cannot reach the primary healthcare centre.',
    sample_voice_3: 'रामनाथपुरम के तटीय इलाके में बोरवेल में खारा पानी आ रहा है, कृपया पेयजल योजना का विस्तार करें।',

    // WhatsApp Simulator
    wa_header_title: 'जनविकास सेतु आधिकारिक बॉट',
    wa_header_status: 'ऑनलाइन · नागरिक शिकायत गेटवे',
    wa_type_placeholder: 'हिन्दी या अंग्रेज़ी में संदेश लिखें...',
    wa_send: 'भेजें',
    wa_record_btn: 'वॉइस',
    wa_preset_1: 'हमारे गांव में सड़क बनवानी है',
    wa_preset_2: 'PHC अस्पताल में नियमित डॉक्टर और दवा चाहिए',
    wa_preset_3: 'पानी की सुविधा नहीं है, पेयजल की कमी है',

    // Grievance Form
    form_heading: 'विस्तृत लोक निर्माण शिकायत फ़ॉर्म',
    field_district: 'ज़िला',
    field_taluk: 'तालुक / ग्राम पंचायत',
    field_category: 'अवसंरचना क्षेत्र',
    field_description: 'अवसंरचना समस्या का विस्तार से वर्णन करें',
    field_description_placeholder: 'उदाहरण: गांव को बस मार्ग से जोड़ने वाली 3 किमी सड़क में गहरे गड्ढे हैं। 4,000 निवासी प्रभावित...',
    field_urgency: 'गंभीरता / अत्यावश्यकता',
    field_contact: 'नागरिक संपर्क (एसएमएस अपडेट के लिए वैकल्पिक)',
    btn_submit_grievance: 'सबमिट करें और आधिकारिक ट्रैकिंग आईडी प्राप्त करें',
    submitting: 'जेमिनी एआई के साथ सबमिशन प्रोसेस हो रहा है...',

    // Community Feed
    community_feed_title: 'सामुदायिक सत्यापित शिकायतें एवं अपवोट फ़ीड',
    community_feed_desc: 'अधिक सामुदायिक अपवोट वाली शिकायतों को ज़िला पूंजीगत व्यय योजना में स्वतः उच्च प्राथमिकता दी जाती है।',
    upvote_btn: 'मुझे भी यह समस्या है',
    upvoted_btn: 'स्वीकृत (+1 प्रभाव)',
    filter_all: 'सभी क्षेत्र',
    search_placeholder: 'ज़िला, गांव या कीवर्ड से शिकायतें खोजें...',

    // Ticket Receipt
    receipt_title: 'आधिकारिक नागरिक शिकायत पावती',
    receipt_tracking_label: 'राष्ट्रीय ट्रैकिंग कोड',
    receipt_sla_label: 'सांविधिक समाधान एसएलए',
    receipt_sla_val: '14 कार्य दिवस (ज़िला कलेक्ट्रेट निगरानी)',
    receipt_qr_sub: 'जनविकास सेतु पोर्टल पर लाइव स्थिति ट्रैक करने के लिए स्कैन करें',
    receipt_close: 'पूर्ण / अन्य समस्या ट्रैक करें',
    receipt_print: 'रसीद डाउनलोड / प्रिंट करें',

    // Policymaker Portal
    policy_hero_title: 'राज्य अवसंरचना मांग एवं पूंजीगत व्यय बुद्धिमत्ता',
    policy_hero_desc: 'नागरिक आवाज़ की मांगों का स्थानिक संश्लेषण अवसंरचना कमी सूचकांकों (NFHS, जनगणना, PMGSY, JJM) के साथ। हॉटस्पॉट पहचानें और कैबिनेट-तैयार डीपीआर तैयार करें।',
    export_report_btn: 'रिपोर्ट निर्यात करें',
    export_report_sub: 'हॉटस्पॉट एवं कमी सूचकांकों की डाउनलोड करने योग्य सीएसवी',
    export_report_success: 'रिपोर्ट सफलतापूर्वक डाउनलोड हुई',

    // KPI Cards
    kpi_total_tickets: 'कुल नागरिक शिकायतें',
    kpi_total_tickets_sub: 'वॉइस, व्हाट्सएप एवं वेब के माध्यम से एकत्रित',
    kpi_mismatch_rate: 'पूंजीगत व्यय संरेखण अंतर',
    kpi_mismatch_rate_sub: 'नागरिक प्राथमिकता से असंगत बजट',
    kpi_high_deficit_panchayats: 'उच्च-कमी वाली पंचायतें',
    kpi_high_deficit_sub: 'अत्यावश्यक अवसंरचना कमी सूचकांक > 70',
    kpi_sanctioned_capex: 'नागरिक-संरेखित पाइपलाइन',
    kpi_sanctioned_sub: 'स्वीकृति हेतु तैयार सक्रिय हस्तक्षेप',

    // Map & Heatmap
    map_section_title: 'स्थानिक अवसंरचना मांग एवं कमी हीटमैप',
    map_legend_low: 'कम कमी (<40)',
    map_legend_mid: 'मध्यम (40-69)',
    map_legend_high: 'गंभीर कमी (>70)',
    map_select_sector: 'सेक्टर हीटमैप फ़िल्टर करें:',
    district_drawer_title: 'ज़िला अवसंरचना डोज़ियर',
    view_details: 'ज़िला डोज़ियर देखें',
    close_drawer: 'डोज़ियर बंद करें',

    // Hotspots & Clusters
    hotspots_title: 'एआई सिस्टमिक मांग हॉटस्पॉट',
    hotspots_desc: 'हज़ारों नागरिक वॉइस नोट्स का असुपरवाइज्ड क्लस्टरिंग, बहु-गांव सिस्टमिक बाधाओं की पहचान करता है।',
    cluster_affected: 'अनुमानित प्रभावित जनसंख्या',
    cluster_urgency: 'मांग अत्यावश्यकता',

    // Prioritization Matrix
    matrix_title: 'जेमिनी बहु-मानदंड परियोजना प्राथमिकता इंजन',
    matrix_desc: 'लाइव नागरिक मांग (40%), कमी गंभीरता (30%), सामाजिक-आर्थिक ROI (20%), और तत्परता (10%) के आधार पर लोक निर्माण पाइपलाइन को एल्गोरिथम रूप से रैंक करता है।',
    btn_run_prioritization: 'जेमिनी एआई से पाइपलाइन का पुनः विश्लेषण करें',
    analyzing_pipeline: 'बहु-मानदंड समानता मैट्रिक्स की गणना हो रही है...',
    col_project: 'प्रस्तावित पूंजीगत परियोजना',
    col_district: 'ज़िला',
    col_budget: 'बजट (₹ करोड़)',
    col_score: 'प्रभाव प्राथमिकता',
    col_tier: 'कैबिनेट कार्रवाई',
    col_action: 'विस्तृत ज्ञापन',
    btn_generate_dpr: 'कैबिनेट डीपीआर तैयार करें',

    // DPR Modal
    dpr_modal_title: 'कैबिनेट-तैयार विस्तृत परियोजना रिपोर्ट (डीपीआर) कार्यकारी ज्ञापन',
    dpr_modal_sub: 'कैबिनेट स्वीकृति के लिए नागरिक मांग साक्ष्य को सार्वजनिक निवेश मीट्रिक्स के साथ जोड़ने वाला स्वचालित संश्लेषण।',
    dpr_generating: 'जेमिनी एआई के साथ द्विभाषी कैबिनेट ज्ञापन तैयार हो रहा है...',
    dpr_print_btn: 'आधिकारिक ज्ञापन प्रिंट करें',
    dpr_copy_btn: 'डीपीआर टेक्स्ट कॉपी करें',
    dpr_close_btn: 'ज्ञापन बंद करें',

    // Categories
    cat_water: 'जल एवं स्वच्छता (JJM)',
    cat_roads: 'ग्रामीण सड़कें एवं राजमार्ग (PMGSY)',
    cat_power: 'बिजली एवं स्ट्रीट लाइटिंग',
    cat_health: 'प्राथमिक स्वास्थ्य सेवा (PM-ABHIM)',
    cat_education: 'स्कूल एवं कॉलेज अवसंरचना',
    cat_sanitation: 'जल निकासी एवं अपशिष्ट प्रबंधन',
    cat_transport: 'सार्वजनिक बस एवं परिवहन संपर्क',
    cat_other: 'नागरिक अवसंरचना',

    // Severities
    sev_critical: 'अति गंभीर (P1)',
    sev_high: 'उच्च (P2)',
    sev_medium: 'मध्यम (P3)',
    sev_low: 'मामूली (P4)',
  },
};
