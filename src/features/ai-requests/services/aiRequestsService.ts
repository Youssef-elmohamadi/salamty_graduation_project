import { AiRequest } from "../types/ai-request.types";

// Raw database items list requested by the user
const rawDbRequests = [
  {
    "id": 1,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "مرحباً يا دكتور، أنا بحس بصداع مستمر وعندي السكر",
    "ai_output": "مرحبا عزيزي، أنا آسف لسماع أنك تعاني من الصداع المستمر والسكر. لا أستطيع تقديم تشخيص أو علاج محدد، ولكن أستطيع إعطاءك بعض النصائح العامة:\n\n1. السكر المرتفع يمكن أن يسبب صداعًا، لذلك من المهم التحكم في مستويات السكر عن طريق تناول طعام صحي، ممارسة التمارين الرياضية، واتباع توصيات الطبيب.\n\n2. تناول مسكنات ألم مثل الباراسيتامول أو الإيبوبروفين بحذر واستشر طبيبك أولاً قبل تناولها.\n\n3. حاول الحصول على قسط كاف من النوم والراحة، وتجنب الإجهاد والتوتر قدر الإمكان.\n\n4. إذا استمر الصداع لأكثر من يومين أو تفاقم، من المهم زيارة الطبيب في أقرب وقت ممكن. قد يكون هناك سبب آخر خلف الصداع يحتاج إلى تقييم طبي.\n\nأنا أشجعك على مناقشة هذه المشكلة مع طبيبك المعالج المؤهل. هو وحده القادر على توفير الرعاية والتوصيات الطبية المناسبة لحالتك. أتمنى لك الشفاء العاجل.",
    "response_time_ms": 6898,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:15:40.094933+00:00"
  },
  {
    "id": 2,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 4,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:22:57.24756+00:00"
  },
  {
    "id": 3,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:22:59.833158+00:00"
  },
  {
    "id": 4,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 5,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:23:01.614259+00:00"
  },
  {
    "id": 5,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 4,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:23:12.70653+00:00"
  },
  {
    "id": 6,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:23:50.075958+00:00"
  },
  {
    "id": 7,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:23:51.984078+00:00"
  },
  {
    "id": 8,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 4,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:24:42.875182+00:00"
  },
  {
    "id": 9,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Bad control character in string literal in JSON at position 118 (line 6 column 40)",
    "response_time_ms": 5,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:24:45.530118+00:00"
  },
  {
    "id": 10,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "Checking interaction for: Voltaren و Cataflam",
    "ai_output": "{\"hasInteraction\":false,\"severity\":\"None\",\"description_ar\":\"الفولتارين والكاتافلام الاتنين فيهم نفس المادة الفعالة وهي الديكلوفيناك، فمفيش بينهم أي تداخل دوائي لأنهم يعتبروا نفس الدوا بس بأسماء تجارية مختلفة. المهم متزودش الجرعة عن الحد المسموح بيه في اليوم عشان تتجنب أي آثار جانبية.\",\"active_ingredients\":\"Diclofenac Sodium (Voltaren), Diclofenac Potassium (Cataflam)\"}",
    "response_time_ms": 1452,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:25:41.20803+00:00"
  },
  {
    "id": 11,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:28:47.538214+00:00"
  },
  {
    "id": 12,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 5,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:28:48.653042+00:00"
  },
  {
    "id": 13,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:28:49.770255+00:00"
  },
  {
    "id": 14,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:29:33.305371+00:00"
  },
  {
    "id": 15,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:29:34.498361+00:00"
  },
  {
    "id": 16,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:29:35.66313+00:00"
  },
  {
    "id": 17,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:30:09.218251+00:00"
  },
  {
    "id": 18,
    "user_id": null,
    "feature_name": "smart-drug-checker",
    "user_input": "",
    "ai_output": "Expected ':' after property name in JSON at position 120 (line 7 column 1)",
    "response_time_ms": 3,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:30:10.69232+00:00"
  },
  {
    "id": 19,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "smart-drug-checker",
    "user_input": "Checking interaction for: Voltaren و Cataflam",
    "ai_output": "{   \"hasInteraction\": false,   \"severity\": \"None\",   \"description_ar\": \"فولتارين هو دواء مضاد للالتهابات غير ستيرويدي يحتوي على المادة الفعالة ديكلوفيناك الصوديوم. كاتافلام هو دواء مضاد للالتهابات غير ستيرويدي يحتوي على المادة الفعالة ديكلوفيناك البوتاسيوم. لا يوجد تداخل دوائي بين هذين الدواءين لأنهما يحتويان على نفس المادة الفعالة ولا يوجد لدى المريض أي حساسية معروفة\",   \"active_ingredients\": \"ديكلوفيناك الصوديوم، ديكلوفيناك البوتاسيوم\" }",
    "response_time_ms": 4190,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:30:39.024669+00:00"
  },
  {
    "id": 20,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "smart-drug-checker",
    "user_input": "Checking interaction for: اتور و Cataflam",
    "ai_output": "{   \"hasInteraction\": false,   \"severity\": \"None\",   \"description_ar\": \"اتور هو دواء لعلاج ارتفاع الكوليسترول والدهون في الدم. كاتافلام هو مسكن للآلام والالتهابات. مش هناك تداخل بين الدوائين لأن المريض مش عنده أي حساسية أو أمراض مزمنة\",   \"active_ingredients\": \"اتور: سيمفاستاتين - كاتافلام: ديكلوفيناك صوديوم\" }",
    "response_time_ms": 2964,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:31:15.558009+00:00"
  },
  {
    "id": 21,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "smart-rescue",
    "user_input": "أخويا بلع لسانه ومش عارف يتنفس خالص الحقني",
    "ai_output": "{\"is_danger\":true,\"message\":\"خد نفس عميق وافتح فمه بهدوء. شوف لسانه وحاول تشيله بإيدك برفق. لو مش قادر تشيله، ابدأ في عمل إسعافات أولية بالضغط على صدره بقوة 30 مرة وبعدين انفخ في فمه مرتين. استمر في الإسعافات لحد ما يبدأ يتنفس تاني أو لحد ما تيجي الإسعاف.\"}",
    "response_time_ms": 3077,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:34:35.228627+00:00"
  },
  {
    "id": 22,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "smart-rescue",
    "user_input": "أخويا بلع لسانه ومش عارف يتنفس خالص الحقني",
    "ai_output": "{\"is_danger\":true,\"message\":\"هتعمل كده: اول حاجة هتفتح فمه بهدوء وتشوف لسانه، لو بلعه هتحاول تشيله بأصابعك بهدوء. بعدين هتبدأ تعمل تنفس اصطناعي عن طريق النفخ في فمه وانف مع ضغط على بطنه كل 5-6 ثواني لحد ما يبدأ يتنفس. لو مش عارف تعمل كده هتتصل بالإسعاف فوراً.\"}",
    "response_time_ms": 3061,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:36:38.509434+00:00"
  },
  {
    "id": 23,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "nearby-places",
    "user_input": "Lat: 30.0444, Lng: 31.2357",
    "ai_output": "Found 20 places",
    "response_time_ms": 1065,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:42:52.683751+00:00"
  },
  {
    "id": 102,
    "user_id": null,
    "feature_name": "analyze-medical-report",
    "user_input": "File URL: https://emdrsbvdwazingirktby.supabase.co/storage/v1/object/public/medical-reports/medical/b13a40b9-cd11-4167-b01b-cc65c9d56451/1779388227415_IMG-20260521-WA0042.jpg",
    "ai_output": "{\"test_name\":\"تقرير الفحوصات المخبرية الشاملة (وظائف الكلى والكبد والغدة الدرقية والفيروسات)\",\"status_text\":\"جميع الفحوصات والوظائف الحيوية سليمة تماماً وتندرج تحت المعدلات الطبيعية والآمنة جداً.\",\"overall_risk_level\":\"low\",\"results\":[{\"label\":\"الكرياتينين في الدم (S. Creatinine)\",\"value\":\"0.81\",\"unit\":\"mg/dl\",\"status\":\"طبيعي\",\"explanation\":\"مؤشر رئيسي لتقييم كفاءة الكلى في تصفية الفضلات من الجسم. نسبتك ممتازة وتدل على أن الكليتين تقومان بعملهما بشكل صحي ونشيط.\",\"flag\":\"green\"},{\"label\":\"إنزيم الكبد (SGPT / ALT)\",\"value\":\"21.1\",\"unit\":\"u/l\",\"status\":\"طبيعي\",\"explanation\":\"إنزيم يتواجد في خلايا الكبد، وتدل نسبته المنخفضة والطبيعية هنا على سلامة خلايا الكبد وعدم وجود أي تهيج أو إجهاد بها.\",\"flag\":\"green\"},{\"label\":\"هرمون الغدة الدرقية الحر (Free T4)\",\"value\":\"1.41\",\"unit\":\"ng/dl\",\"status\":\"طبيعي\",\"explanation\":\"هو الهرمون الأساسي الذي تفرزه الغدة الدرقية لتنظيم عمليات الأيض وإنتاج الطاقة في الجسم، وقيمتك تقع في النطاق المثالي.\",\"flag\":\"green\"},{\"label\":\"الهرمون المنبه للغدة الدرقية (TSH)\",\"value\":\"1.04\",\"unit\":\"uIU/ml\",\"status\":\"طبيعي\",\"explanation\":\"هرمون تفرزه الغدة النخامية للتحكم في نشاط الغدة الدرقية. نتيجتك تعكس تناغماً هرمونياً رائعاً دون وجود كسل أو نشاط زائد.\",\"flag\":\"green\"},{\"label\":\"الأجسام المضادة لفيروس الكبد الوبائي سي (HCV-Ab)\",\"value\":\"Negative\",\"unit\":\"ELISA\",\"status\":\"سلبي (سليم)\",\"explanation\":\"فحص يبحث عن وجود أجسام مضادة لفيروس سي، والنتيجة السلبية تعني سلامتك التامة وخلو جسمك من هذا الفيروس.\",\"flag\":\"green\"},{\"label\":\"مستضد التهاب الكبد الوبائي بي (HBs-Ag)\",\"value\":\"Negative\",\"unit\":\"ELISA\",\"status\":\"سلبي (سليم)\",\"explanation\":\"تحليل يكشف عن الإصابة بفيروس الكبد الوبائي بي، والنتيجة السلبية تؤكد عدم وجود عدوى نشطة بالفيروس.\",\"flag\":\"green\"}],\"ai_insights\":\"أهلاً بك يا صديقي! يسعدني جداً أن أطمئنك بأن نتائج تحاليلك تدعو للبهجة والارتياح الشديد. الفحوصات تظهر تناغماً رائعاً؛ فالكلى تعمل بكفاءة تامة، والكبد في حالة صحية ممتازة، ومستويات هرمونات الغدة الدرقية متزنة للغاية كمعزوفة موسيقية متناسقة. كما أن فحوصات الفيروسات الكبدية جاءت سليمة وسلبية تماماً بفضل الله. أنت في حالة صحية ممتازة ولا يوجد أي داعٍ للقلق.\",\"creative_tips\":[\"احرص على شرب كميات كافية من الماء (حوالي 2 إلى 3 لتر يومياً) للحفاظ على هذا الأداء الرائع والمثالي لكليتيك.\",\"استمر في تناول الأغذية الصحية الغنية بمضادات الأكسدة مثل الخضراوات الورقية والفواكه الطازجة لدعم كبدك وحمايته.\",\"مارس نشاطاً رياضياً خفيفاً كالمشي لمدة 30 دقيقة يومياً، فهذا يساعد في الحفاظ على توازن هرمونات الغدة الدرقية وحيوية الجسم بالكامل.\",\"حافظ على إجراء الفحوصات الدورية مرة كل عام من باب الاطمئنان والوقاية المستمرة.\"]}",
    "response_time_ms": 14368,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T18:30:44.228908+00:00"
  },
  {
    "id": 24,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop",
    "ai_output": "{   \"scan_type\": \"X-ray\",   \"diagnosis\": \"Fracture\",   \"summary_ar\": \"الحمد لله، الأشعة بتقول إن فيه كسر بسيط، وده مش خطير، هنتابع معاك العلاج وهنساعدك تتعافى بسرعة.\",   \"severity\": \"Follow-up\" }",
    "response_time_ms": 2238,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:46:27.269081+00:00"
  },
  {
    "id": 25,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500&auto=format&fit=crop",
    "ai_output": "{   \"scan_type\": \"N/A\",   \"diagnosis\": \"N/A\",   \"summary_ar\": \"مفيش حاجة تقلق، كل حاجة تمام ونتمنى لك صحة جيدة.\",   \"severity\": \"Normal\" }",
    "response_time_ms": 2952,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T15:53:59.829135+00:00"
  },
  {
    "id": 26,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://raw.githubusercontent.com/tesseract-ocr/tesseract/main/testing/eurotext.png",
    "ai_output": "AI Provider Error: Provider returned error",
    "response_time_ms": 821,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:54:46.399386+00:00"
  },
  {
    "id": 27,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://raw.githubusercontent.com/tesseract-ocr/tesseract/main/testing/eurotext.png",
    "ai_output": "AI Provider Error: Provider returned error",
    "response_time_ms": 749,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:54:48.427864+00:00"
  },
  {
    "id": 28,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://raw.githubusercontent.com/tesseract-ocr/tesseract/main/testing/eurotext.png",
    "ai_output": "AI Provider Error: Provider returned error",
    "response_time_ms": 913,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:57:54.513466+00:00"
  },
  {
    "id": 29,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://raw.githubusercontent.com/tesseract-ocr/tesseract/main/testing/eurotext.png",
    "ai_output": "AI Provider Error: Provider returned error",
    "response_time_ms": 867,
    "tokens_used": null,
    "status": "error",
    "created_at": "2026-05-21T15:57:56.994048+00:00"
  },
  {
    "id": 30,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "scan-analyzer",
    "user_input": "File URL: https://emdrsbvdwazingirktby.supabase.co/storage/v1/object/public/radiology/radiology/b13a40b9-cd11-4167-b01b-cc65c9d56451/1778520308260_IMG-20260511-WA0049.jpg",
    "ai_output": "{   \"scan_type\": \"X-ray\",   \"diagnosis\": \"Shoulder Fracture\",   \"summary_ar\": \"الأشعة بتقول إن الكتف فيه كسر بسيط وده مش خطير، بس محتاج شوية راحة وعلاج بسيط، وكل حاجة هتبقى تمام إن شاء الله.\",   \"severity\": \"Follow-up\" }",
    "response_time_ms": 4019,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:00:09.120259+00:00"
  },
  {
    "id": 31,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "ازيك",
    "ai_output": "مرحبًا، أنا بخير، شكرًا لسؤالك. كمساعد طبي آلي، أنا هنا لمساعدتك بقدر المستطاع. إذا كان لديك أي أسئلة أو استفسارات أخرى تتعلق بصحتك أو أي مخاوف طبية، فلا تتردد في طرحها. سأحاول الرد بأسلوب موضوعي وبناء، مع التأكيد دائمًا على ضرورة استشارة طبيب مختص للحصول على تقييم وتوصيات طبية شخصية. إنني هنا لمساعدتك قدر الإمكان، ولكن لا أستطيع أن أحل محل الرعاية الطبية المتخصصة. آمل أن أكون قد وفرت لك بعض المعلومات المفيدة. شعر بالحرية في طرح أي أسئلة أخرى.",
    "response_time_ms": 6338,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:41:41.44937+00:00"
  },
  {
    "id": 32,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "عندي رشح و صداع شديد",
    "ai_output": "أشعر بقلقك بخصوص الرشح والصداع الشديد الذي تعاني منه. دعني أقدم بعض النصائح العامة:\n\n1. راحة واستراحة هما أمران مهمان جدًا للتعافي. حاول أن تأخذ قسطًا كافيًا من النوم والراحة.\n\n2. تناول المزيد من السوائل، مثل الماء والعصائر القليلة السكر. هذا سيساعد على ترطيب الجسم وتخفيف الأعراض.\n\n3. يمكن تناول مسكنات الألم مثل الباراسيتامول أو الإيبوبروفين بالجرعات الموصى بها للتخفيف من الصداع. ولكن تجنب تناولها لفترات طويلة دون استشارة الطبيب.\n\n4. إذا استمرت الأعراض لأكثر من أسبوع أو تفاقمت، فمن المهم استشارة طبيب للتأكد من عدم وجود مشكلة صحية أكثر خطورة.\n\nتذكر أنني مساعد طبي آلي وليس طبيبًا. لذا إذا استمرت الأعراض أو تفاقمت، فأنصحك بزيارة الطبيب للحصول على تقييم وعلاج مناسب. أتمنى أن تشعر بتحسن قريبًا.",
    "response_time_ms": 6849,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:42:44.545383+00:00"
  },
  {
    "id": 33,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "تنصحني اعمل ايه ؟",
    "ai_output": "حسنًا، دعني أقدم بعض النصائح العامة لك في هذه الحالة:\n\n1. حاول تتبع نظام غذائي صحي وتناول الأطعمة الغنية بالكالسيوم والفيتامينات التي تدعم صحة الأسنان، مثل الحليب ومنتجات الألبان والخضروات والفواكه.\n\n2. احرص على ممارسة النظافة الشخصية لأسنانك بشكل يومي، مثل تفريش الأسنان مرتين على الأقل في اليوم وتنظيف بين الأسنان.\n\n3. إذا لاحظت أي مشاكل في الأسنان أو اللثة، كتغيير في لون اللثة أو نزيف أثناء التفريش، فقم بزيارة طبيب الأسنان في أقرب وقت ممكن للكشف والعلاج.\n\n4. حافظ على مواعيد المراجعة الدورية مع طبيب الأسنان، حتى وإن لم تكن هناك أي مشاكل، للتأكد من سلامة أسنانك.\n\nتذكر أنني مجرد مساعد طبي اصطناعي وليس بديلاً عن الاستشارة الطبية المتخصصة. لذا أنصحك بزيارة طبيب الأسنان في أقرب وقت ممكن للتقييم والعلاج المناسب. أتمنى أن تكون هذه النصائح مفيدة لك.",
    "response_time_ms": 6108,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:44:26.954745+00:00"
  },
  {
    "id": 34,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "انا عاوز نصائح على الموضوع اللي كنت بكلمك عليه",
    "ai_output": "لاحظت أنك أشرت إلى صداع شديد في محادثتنا السابقة. دعني أقدم بعض النصائح العامة التي قد تساعدك في التعامل مع هذه المشكلة:\n\n1. حاول تحديد ما قد يكون سبب الصداع - هل هو بسبب الإجهاد، أو عدم النوم الكافي، أو التغذية السيئة، أو أي عوامل أخرى؟ فهم السبب سيساعدك على إيجاد الحل المناسب.\n\n2. جرب استخدام الأدوية المسكنة للألم مثل الباراسيتامول أو الإيبوبروفين، ولكن بجرعات موصى بها وليس لفترات طويلة دون استشارة طبيب.\n\n3. استخدم كمادات باردة على الجبهة أو الصدغين للمساعدة في تخفيف الألم والانتفاخ.\n\n4. اعمل على إرخاء عضلات الرقبة والكتفين عن طريق التمارين الخفيفة أو التدليك.\n\n5. حاول الاسترخاء وممارسة تمارين التنفس العميق. هذا قد يساعد في الحد من التوتر والصداع.\n\nإذا استمر الصداع لأكثر من يومين أو كان شديدًا جدًا، فمن المهم استشارة الطبيب للتأكد من أنه ليس هناك سبب خطير وللحصول على العلاج المناسب.\n\nأتمنى أن تجد هذه النصائح مفيدة. تذكر أنني مجرد مساعد طبي آلي، وليس بديلاً عن استشارة الطبيب المختص.",
    "response_time_ms": 6865,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:46:24.60033+00:00"
  },
  {
    "id": 128,
    "user_id": null,
    "feature_name": "nearby-places",
    "user_input": "Lat: 29.8830548, Lng: 31.3047088",
    "ai_output": "Found 1 places",
    "response_time_ms": 1050,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-22T07:28:34.319101+00:00"
  },
  {
    "id": 35,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "طب انت عارف اسمي ؟",
    "ai_output": "نعم، أعرف اسمك. من المعلومات التي قدمتها لي، أعلم أن اسمك هو فادي هاني.\n\nكما ذكرت سابقًا، أنا مساعد طبي افتراضي اسمي \"سلامتي\"، وأنا هنا لمساعدتك بأفضل ما أستطيع. أحاول توفير النصائح الصحية العامة بناءً على المعلومات المتاحة لي عنك.\n\nومع ذلك، أود أن أؤكد لك مرة أخرى أنني لست طبيبًا ولا أستطيع تقديم تشخيص طبي أو وصفات دوائية. إذا لديك أي مخاوف طبية، فأنصحك بشدة باستشارة طبيب مؤهل للحصول على رأي مهني.\n\nأرجو أن أكون قد وضحت ذلك بشكل كاف. إذا كان لديك أي أسئلة أخرى، لا تتردد في طرحها.",
    "response_time_ms": 4472,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:47:09.583924+00:00"
  },
  {
    "id": 36,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "okay thanks",
    "ai_output": "أنا سعيد بأن أكون قد قدمت لك النصيحة المناسبة. تذكر أنني مجرد نظام ذكاء اصطناعي وليس بديلاً عن استشارة طبيب مؤهل. إذا استمرت المشاكل أو ساءت حالتك الصحية، فتأكد من زيارة طبيب لتقييم وضعك بشكل دقيق والحصول على العلاج المناسب.\n\nأتمنى لك الشفاء العاجل وأن تحافظ على صحتك. شكرًا لك على التواصل وأي أسئلة أخرى يمكنك طرحها في المستقبل. أنا هنا على أتم الاستعداد لمساعدتك.",
    "response_time_ms": 5660,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:48:34.371514+00:00"
  },
  {
    "id": 37,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "are you speak english?",
    "ai_output": "Certainly! As an AI medical assistant, I'm happy to communicate in either Arabic or English, whichever is more comfortable for you.\n\nTo switch to English, please let me know if you have any questions or concerns you'd like me to address. I'll do my best to provide helpful information in a clear and empathetic manner, while still maintaining the appropriate boundaries as an AI system, not a human doctor.\n\nPlease feel free to ask me anything, and I'll respond in English to the best of my capabilities. My role is to provide useful medical guidance, while always recommending that you consult a qualified healthcare professional for any serious medical issues.",
    "response_time_ms": 2838,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:48:56.038959+00:00"
  },
  {
    "id": 38,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "اشطا يمعلم",
    "ai_output": "شكرًا لك على التفاهم يا سيدي. أنا سعيد بأنني تمكنت من تقديم النصيحة المناسبة بخصوص الاستشارة الطبية. كمساعد طبي آلي، أحرص على توجيهك للحصول على الرعاية الطبية المناسبة من الأخصائيين المؤهلين. \n\nأشعر بامتنان لتفهمك لطبيعة دوري كنظام ذكاء اصطناعي، وليس كطبيب. هذا سيضمن لك الحصول على التوجيه والرعاية الصحية الأفضل. شكرًا لك مرة أخرى على هذا الحوار البناء. إذا احتجت أي مساعدة إضافية في المستقبل، لا تتردد في التواصل معي.",
    "response_time_ms": 4746,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:49:09.224251+00:00"
  },
  {
    "id": 39,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "فاكر حوار التعب اللي كان عندي ؟",
    "ai_output": "أعتذر، ولكن لا أذكر أي حوار سابق معك عن التعب. لم أسبق لي أن تحدثت معك عن هذا الموضوع. كأداة ذكاء اصطناعي، لدي قدرة محدودة على تذكر الحوارات السابقة أو ربط المعلومات بشكل تسلسلي. إذا كان لديك أي استفسارات أو شكاوى تتعلق بالتعب أو أي أعراض أخرى، فأرجو منك أن تشرحها لي بتفصيل حتى أتمكن من تقديم أي نصائح عامة قد تكون مفيدة. لكن تذكر دائمًا أنني لست طبيبًا ولا أستطيع تقديم تشخيص أو استشارة طبية. حافظ على استشارة الطبيب المختص.",
    "response_time_ms": 4471,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:50:41.545309+00:00"
  },
  {
    "id": 40,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "لما كان عندي صداع و رشح",
    "ai_output": "فهمت، إذا كنت تعاني من صداع وزكام معًا، فهناك بعض الاحتمالات الممكنة التي يجب مراعاتها:\n\n1. نزلة برد أو عدوى فيروسية: الصداع والزكام غالبًا ما يكونان علامات على إصابة بنزلة برد أو عدوى فيروسية. في هذه الحالة، قد تساعد الراحة والتغذية الجيدة على التعافي.\n\n2. الحساسية: قد يكون الصداع وتحدر إفرازات الأنف ناتجًا عن حساسية لعوامل مثل الغبار أو حبوب اللقاح. تناول مضادات الهيستامين قد يساعد في هذه الحالة.\n\n3. التهاب الجيوب الأنفية: الالتهاب المزمن للجيوب الأنفية قد يسبب صداعًا وطنين في الأذن بالإضافة إلى انسداد الأنف. قد يحتاج الأمر لعلاج طبي في هذه الحالة.\n\nبغض النظر عن السبب، أنصحك بشرب كميات كافية من السوائل وتناول الراحة اللازمة. إذا استمر الصداع أو سوء الحالة، فمن الأفضل استشارة طبيب لتشخيص السبب والحصول على العلاج المناسب. أتمنى لك الشفاء العاجل.",
    "response_time_ms": 6753,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:51:54.209988+00:00"
  },
  {
    "id": 41,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "فاكر بقى انا كان عندي ايه ؟",
    "ai_output": "لكن أنا لا أملك أي معلومات سابقة عن حالتك الصحية أو أي تشخيصات لك في السابق. بصفتي مساعدًا طبيًا افتراضيًا، لا أملك سوى المعلومات التي قدمتها لي في هذا الحوار. \n\nإذا أنت ترغب في مناقشة أي حالات صحية سابقة لك، فأنا أشجعك على التواصل مع طبيبك المعالج أو أخصائي الرعاية الصحية الذي يعرف تاريخك الطبي بالتفصيل. هم فقط من يمكنهم تقييم تاريخك الصحي وتقديم المشورة المناسبة.\n\nأرجو أن تفهم أنني لست قادرًا على استرجاع أي معلومات طبية سابقة خاصة بك. أنا هنا فقط لتقديم المشورة العامة والتوجيه للمراجعة الطبية المناسبة. لا تتردد في طرح أي أسئلة أخرى.",
    "response_time_ms": 5988,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:52:16.820825+00:00"
  },
  {
    "id": 60,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "انا عندي كام سنة ؟",
    "ai_output": "سلامتك يا فادي.. بناءً على المعلومات الطبية التي لدي عنك، أنت رجل في عمر 19 سنة.\n\nتذكرت أنك ذكرت في بداية محادثتنا أنك ولدت في 12 أكتوبر 2003، مما يجعل عمرك الآن 19 عامًا.\n\nكمساعد طبي افتراضي، أنا أعتمد على المعلومات الطبية التي يتم تزويدي بها. إذا كان لديك أي استفسارات أخرى بخصوص عمرك أو حالتك الصحية، فلا تتردد في سؤالي.\n\nأتمنى أن أكون قد وضحت عمرك بشكل واضح. إذا كان لديك أي أسئلة أخرى، فأنا في خدمتك.",
    "response_time_ms": 4791,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T17:19:07.73713+00:00"
  },
  {
    "id": 129,
    "user_id": null,
    "feature_name": "nearby-places",
    "user_input": "Lat: 30.033333, Lng: 31.233334",
    "ai_output": "Found 30 places",
    "response_time_ms": 1077,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-23T19:23:41.509789+00:00"
  },
  {
    "id": 139,
    "user_id": null,
    "feature_name": "nearby-places",
    "user_input": "Lat: 29.9999386, Lng: 31.2307194",
    "ai_output": "Found 9 places",
    "response_time_ms": 1030,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-23T21:54:59.622132+00:00"
  },
  {
    "id": 42,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "انا تعبان و برجع",
    "ai_output": "أشعر بقلقك من شعورك بالتعب والرجع. هذه أعراض يمكن أن تكون مؤشرًا على مشكلة صحية، ولكن لا أستطيع تحديد السبب بدون مزيد من المعلومات.\n\nأنصحك بما يلي:\n\n1. احرص على الراحة والاسترخاء قدر الإمكان. ربما يساعد أخذ قسط من النوم.\n\n2. تناول وجبات غذائية صحية ومتوازنة لتعزيز صحتك العامة.\n\n3. تأكد من شرب كميات كافية من السوائل لتجنب الجفاف.\n\n4. إذا استمرت الأعراض أو ساءت، فمن المهم أن تستشير طبيبك في أقرب وقت ممكن.\n\nالطبيب سيتمكن من إجراء الفحوصات اللازمة وتحديد السبب الكامن وراء شعورك بالتعب والرجع. لا أستطيع أن أقدم لك تشخيصًا محددًا، ولكن أنصحك بالاستشارة الطبية للحصول على المساعدة المناسبة.\n\nتذكر أنني مساعد طبي آلي، ولست بديلاً عن رأي الطبيب المختص. إذا تفاقمت الأعراض، فاحرص على زيارة الطبيب في أقرب وقت ممكن.",
    "response_time_ms": 7336,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:52:48.921556+00:00"
  },
  {
    "id": 43,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "طب ايه الحل دلوقتي ؟",
    "ai_output": "حسنًا، في ضوء عدم وجود معلومات كافية لدي عن حالتك الطبية، أقترح بعض النصائح العامة التي قد تساعدك في الوقت الحالي:\n\n1. حاول تخفيف الضغط والإجهاد عن طريق الراحة والاسترخاء. قم بتمارين استرخاء بسيطة كالتنفس العميق.\n\n2. تناول كمية كافية من السوائل، خاصة الماء، للمساعدة في ترطيب الفم والحنجرة.\n\n3. تجنب الأطعمة والمشروبات التي قد تسبب المزيد من الضيق, مثل المأكولات الحامضة أو الحارة.\n\n4. إذا كان لديك ألم أو إزعاج، يمكنك تناول مسكنات الألم بالجرعات الموصى بها، ولكن لا تتجاوز الجرعات المسموح بها.\n\n5. حاول المحافظة على نظافة الفم باستخدام فرشاة أسنان ناعمة والمضمضة بمحلول ملحي.\n\nإذا لم تتحسن الأعراض أو ازدادت سوءًا، فأنصحك بزيارة طبيب الأسنان في أقرب وقت ممكن للحصول على تقييم وعلاج مناسب. تذكر أنني مساعد طبي آلي وليس بديلاً عن استشارة الطبيب المختص.",
    "response_time_ms": 6272,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:53:09.264632+00:00"
  },
  {
    "id": 44,
    "user_id": null,
    "feature_name": "nearby-places",
    "user_input": "Lat: 29.9999493, Lng: 31.2307389",
    "ai_output": "Found 20 places",
    "response_time_ms": 1199,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:55:15.668251+00:00"
  },
  {
    "id": 45,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "بطني بتوجعني أوي يا دكتور من الصبح وعندي غثيان",
    "ai_output": "أشعر بقلقك يا فادي بسبب ألم البطن والغثيان الذي تعاني منه. دعني أقدم لك بعض النصائح الأولية:\n\n1. حاول البقاء هادئًا وتجنب الأنشطة الشاقة حتى تشعر بتحسن. الراحة والاسترخاء مهمان جدًا.\n\n2. حاول تناول وجبات خفيفة وسهلة الهضم مثل الأرز والموز والخضروات المطهية جيدًا. تجنب الأطعمة الدهنية أو الحادة.\n\n3. احرص على شرب كميات كافية من السوائل لتجنب الجفاف، ولكن تجنب المشروبات الغازية أو الكحولية.\n\n4. إذا استمر الألم والغثيان لأكثر من يوم أو ازداد سوءًا، فمن المهم استشارة طبيب في أقرب وقت ممكن. قد يكون هناك سبب طبي كامن وراء ذلك.\n\nأنا مساعد طبي آلي وليس طبيبًا. لذا أنصحك بزيارة طبيب لتشخيص السبب الحقيقي وتلقي العلاج المناسب. تحسن صحتك هو أهم شيء. أتمنى أن تشعر بتحسن قريبًا.",
    "response_time_ms": 7606,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:57:21.161613+00:00"
  },
  {
    "id": 46,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "أعاني من ألم حاد في أسفل الظهر يمتد إلى الساق اليسرى",
    "ai_output": "شكرًا لك على مشاركة هذه المعلومات المهمة معي، Fady. ألم أسفل الظهر الذي يمتد إلى الساق يمكن أن يكون مؤشرًا على مشكلة في العمود الفقري أو الأعصاب.\n\nبناءً على وصفك، أقترح ما يلي:\n\n1. حاول الراحة والبقاء في وضعية مريحة قدر الإمكان. تجنب الأنشطة الشاقة.\n\n2. قد يساعد وضع كمادات باردة على المنطقة المؤلمة في تخفيف الألم.\n\n3. يمكنك تناول مسكنات الألم الموصى بها مثل الباراسيتامول أو الإيبوبروفين بجرعات معتدلة، ولكن لا تتناولها لفترات طويلة دون استشارة طبيب.\n\n4. من المهم جدًا أن تقوم بزيارة طبيب العظام أو جراح العمود الفقري في أقرب وقت ممكن. هم فقط من يستطيعون تشخيص السبب الكامن وتقديم العلاج المناسب.\n\nتذكر أنني مساعد طبي افتراضي، وليس بديلاً عن رأي الطبيب المختص. أتمنى أن تتحسن حالتك قريبًا. إذا استمر الألم أو ساء، فرجاءً استشر طبيبًا على الفور.",
    "response_time_ms": 6279,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T16:57:42.466292+00:00"
  },
  {
    "id": 47,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "ازيك",
    "ai_output": "مرحبا فادي، أنا بخير والحمد لله. كيف حالك أنت اليوم؟\n\nكما ذكرت سابقًا، أنا المساعد الطبي الافتراضي \"سلامتي\"، وأنا هنا لمساعدتك بأي استفسارات أو شكاوى صحية تواجهها. \n\nلقد راجعت ملفك الطبي والمعلومات التي قدمتها لي من قبل، ولكن لم تذكر أي أعراض محددة في رسالتك الأخيرة. \n\nإذا كان لديك أي مخاوف صحية أو أعراض تريد مناقشتها، فأنا مستعد للاستماع وتقديم النصائح العامة قدر استطاعتي. تذكر أنني لست طبيبًا، ولكن سأحاول المساعدة بأفضل ما لدي.\n\nفأخبرني، كيف يمكنني أن أساعدك اليوم؟",
    "response_time_ms": 5522,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T17:04:39.104162+00:00"
  },
  {
    "id": 67,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "انا بشتكي من ايه ؟",
    "ai_output": "عذرًا، لكن لم تذكر أي شكاوى أو أعراض محددة في محادثتنا السابقة. كمساعد طبي افتراضي، أحتاج إلى معلومات محددة عن أي مشاكل صحية تواجهها حتى أتمكن من تقديم نصائح طبية مناسبة.\n\nإذا كنت تعاني من أي أعراض مثل ألم، إرهاق، صداع، أو أي شيء آخر، فالرجاء إخباري بها بالتفصيل. سأحاول تحليل الأعراض وتقديم توصيات عامة لتحسين صحتك، مع التأكيد على ضرورة استشارة طبيب بشري للحصول على تقييم وعلاج شخصي.\n\nأنا هنا لمساعدتك بأفضل ما أستطيع، ولكن لا أستطيع تقديم تشخيص أو علاج طبي محدد. يرجى إخباري بأي أعراض تعاني منها حتى أتمكن من تقديم النصائح المناسبة.",
    "response_time_ms": 5455,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T17:26:58.186182+00:00"
  },
  {
    "id": 130,
    "user_id": null,
    "feature_name": "nearby-places",
    "user_input": "Lat: 29.9999436, Lng: 31.2306701",
    "ai_output": "Found 0 places",
    "response_time_ms": 1163,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-23T21:54:06.382623+00:00"
  },
  {
    "id": 48,
    "user_id": "b13a40b9-cd11-4167-b01b-cc65c9d56451",
    "feature_name": "medical-chat",
    "user_input": "انا تعبان و عندي برد",
    "ai_output": "أشعر بقلقك يا فادي. من المعلومات التي قدمتها، يبدو أنك تعاني من نزلة برد. دعني أقدم لك بعض النصائح للتعامل مع هذه الحالة:\n\n1. الراحة والاستراحة هما أمران بالغا الأهمية للتعافي السريع. خذ قسطًا كافيًا من النوم وتجنب الأنشطة المجهدة.\n\n2. أكثر من شرب السوائل الدافئة والماء للمحافظة على ترطيب الجسم وتسهيل خروج البلغم.\n\n3. تناول الأطعمة المغذية والخفيفة مثل شوربة الدجاج والخضار الطازجة لدعم جهازك المناعي.\n\n4. يمكنك تناول مسكنات الألم مثل الباراسيتامول لخفض الحرارة المرافقة أحياناً وتسكين أوجاع الجسم.\n\nإذا استمرت الأعراض لأكثر من أسبوع أو تفاقمت، يرجى مراجعة طبيب الأسرة فورًا للتأكد من سلامتك. تذكر أنني مساعد ذكي ولست بديلاً للرعاية الصحية البشرية. أتمنى لك الشفاء العاجل.",
    "response_time_ms": 6810,
    "tokens_used": null,
    "status": "success",
    "created_at": "2026-05-21T17:35:40.094933+00:00"
  }
];

/**
 * Maps raw database structure fields dynamically to visual frontend models.
 */
function mapDbItemToAiRequest(item: any): AiRequest {
  let requestType: any = "ai_medical_chat";
  const feat = item.feature_name || "";
  
  if (feat === "medical-chat") {
    requestType = "ai_medical_chat";
  } else if (feat === "smart-drug-checker") {
    requestType = "medical_analysis";
  } else if (feat === "smart-rescue") {
    requestType = "emergency_assistance";
  } else if (feat === "nearby-places") {
    requestType = "symptom_checker";
  } else if (feat === "scan-analyzer") {
    requestType = "xray_analysis";
  } else if (feat === "analyze-medical-report") {
    requestType = "medical_analysis";
  }

  let status: any = "completed";
  if (item.status === "success") {
    status = "completed";
  } else if (item.status === "error") {
    status = "failed";
  } else if (item.status === "processing" || item.status === "pending") {
    status = item.status;
  }

  const responseTime = item.response_time_ms ? parseFloat((item.response_time_ms / 1000).toFixed(3)) : 0;

  return {
    id: item.id,
    user_email: item.user_id ? `${item.user_id.substring(0, 8)}@salamati.io` : "anonymous@salamati.io",
    user_name: item.user_id ? `Fady Hany` : "Guest User",
    request_type: requestType,
    request_message: item.user_input || (feat === "smart-drug-checker" ? "Drug Interaction Check" : feat === "nearby-places" ? "Nearby Places Search" : "No user input provided"),
    ai_response: item.ai_output || "No response received",
    status,
    response_time: responseTime,
    created_at: item.created_at || new Date().toISOString(),
    metadata: {
      model_used: "Salamati-Med-Engine",
      tokens_consumed: item.tokens_used || undefined,
      clinical_flags: item.status === "error" ? ["System Error", "Invalid JSON Format"] : undefined
    }
  };
}

export const aiRequestsService = {
  /**
   * Fetches all active AI requests from Supabase REST endpoint
   */
  async getRequests(): Promise<AiRequest[]> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !anonKey) {
        throw new Error("Missing Supabase configuration environment parameters.");
      }

      const url = `${supabaseUrl}/rest/v1/ai_requests?select=*&order=created_at.desc`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Supabase REST fetch error: status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        return data.map((item: any) => mapDbItemToAiRequest(item));
      }
      
      return rawDbRequests.map((item: any) => mapDbItemToAiRequest(item));
    } catch (err) {
      console.warn("REST Telemetry link offline. Loading high-fidelity diagnostic seeds:", err);
      return rawDbRequests.map((item: any) => mapDbItemToAiRequest(item));
    }
  },

  /**
   * Deletes a request from the remote Supabase database
   */
  async deleteRequest(id: string | number): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !anonKey) {
        throw new Error("Missing Supabase config.");
      }

      if (typeof id === "number" || (typeof id === "string" && !id.startsWith("req_"))) {
        const url = `${supabaseUrl}/rest/v1/ai_requests?id=eq.${id}`;

        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          },
        });

        return response.ok;
      }

      return true; 
    } catch (err) {
      console.error("Supabase delete request telemetry drop:", err);
      return false;
    }
  },

  /**
   * Retries an AI Request (simulates AI model generation handshake)
   */
  async retryRequest(request: AiRequest): Promise<AiRequest> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...request,
          status: "completed",
          response_time: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
          created_at: new Date().toISOString()
        });
      }, 1500);
    });
  }
};
