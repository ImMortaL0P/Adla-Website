/**
 * Bilingual narrative/list content that doesn't fit the flat translations.ts
 * dictionary (mirrors the pattern used in academics.ts).
 *
 * Placeholder discipline: no invented history, dates, or statistics.
 * Where the real fact isn't known, the value says so plainly (see DEV.md §2).
 */

export const aboutContent = {
  history: {
    en: 'Established in 2008, Uccha Madhyamik Vidyalaya Adala is a Bihar Government school serving students from Class 1 to Class 12 in Adla village, Naubatpur block, Patna district. As an "Uccha Madhyamik" (higher secondary) institution, the school offers secondary and senior secondary education alongside its primary and middle sections. A detailed account of the school’s history since its founding is being compiled by the school administration and will be published here.',
    hi: '2008 में स्थापित, उच्च माध्यमिक विद्यालय अदला बिहार सरकार का एक विद्यालय है जो पटना जिले के नौबतपुर प्रखंड के अदला गाँव में कक्षा 1 से कक्षा 12 तक के विद्यार्थियों को शिक्षा प्रदान करता है। एक "उच्च माध्यमिक" संस्थान के रूप में, यह विद्यालय अपने प्राथमिक एवं मध्य विभागों के साथ-साथ माध्यमिक एवं उच्चतर माध्यमिक शिक्षा भी प्रदान करता है। स्थापना के बाद से विद्यालय के इतिहास का विस्तृत विवरण विद्यालय प्रशासन द्वारा तैयार किया जा रहा है और शीघ्र ही यहाँ प्रकाशित किया जाएगा।',
  },
  management: {
    en: 'The school is managed by the Department of Education, Government of Bihar, and administered locally by the Headmaster/Principal along with the teaching and non-teaching staff. Details of the School Management Committee (SMC) will be published here once available.',
    hi: 'विद्यालय का संचालन शिक्षा विभाग, बिहार सरकार द्वारा किया जाता है तथा स्थानीय प्रशासन प्रधानाध्यापक/प्रधानाचार्य एवं शिक्षण व गैर-शिक्षण स्टाफ द्वारा किया जाता है। विद्यालय प्रबंधन समिति (SMC) का विवरण उपलब्ध होने पर यहाँ प्रकाशित किया जाएगा।',
  },
  // Placeholder milestones — obviously-placeholder values, not invented dates.
  milestones: [1, 2, 3, 4].map((n) => ({
    year: 'XXXX',
    title_en: `Milestone ${n} — to be updated`,
    title_hi: `मील का पत्थर ${n} — अद्यतन किया जाना है`,
    desc_en: 'Description to be added by the school administration.',
    desc_hi: 'विवरण विद्यालय प्रशासन द्वारा जोड़ा जाएगा।',
  })),
}

export const facilitiesList = [
  {
    icon: 'BookOpen',
    key: 'library',
    desc: {
      en: 'A collection of textbooks and reference material supporting reading and self-study.',
      hi: 'पठन एवं स्व-अध्ययन में सहायक पाठ्यपुस्तकों एवं संदर्भ सामग्री का संग्रह।',
    },
  },
  {
    icon: 'FlaskConical',
    key: 'scienceLab',
    desc: {
      en: 'Space for hands-on experiments in physics, chemistry and biology.',
      hi: 'भौतिकी, रसायन एवं जीव विज्ञान में प्रायोगिक शिक्षण हेतु स्थान।',
    },
  },
  {
    icon: 'Monitor',
    key: 'computerLab',
    desc: {
      en: 'Computers supporting basic digital literacy and IT classes.',
      hi: 'बुनियादी डिजिटल साक्षरता एवं कंप्यूटर शिक्षा हेतु कंप्यूटर।',
    },
  },
  {
    icon: 'Trees',
    key: 'playground',
    desc: {
      en: 'Open ground used for sports, physical education and the morning assembly.',
      hi: 'खेलकूद, शारीरिक शिक्षा एवं प्रार्थना सभा हेतु खुला मैदान।',
    },
  },
  {
    icon: 'Utensils',
    key: 'midDayMeal',
    desc: {
      en: 'Hot cooked meals served under the Government Mid-Day Meal Scheme.',
      hi: 'सरकारी मध्याह्न भोजन योजना के अंतर्गत गर्म पका हुआ भोजन।',
    },
  },
  {
    icon: 'Droplets',
    key: 'drinkingWater',
    desc: {
      en: 'Safe drinking water available on campus.',
      hi: 'परिसर में शुद्ध पेयजल की उपलब्धता।',
    },
  },
  {
    icon: 'DoorClosed',
    key: 'toilets',
    desc: {
      en: 'Separate toilet facilities for boys and girls.',
      hi: 'बालक एवं बालिकाओं हेतु अलग-अलग शौचालय सुविधा।',
    },
  },
  {
    icon: 'ShieldCheck',
    key: 'boundaryWall',
    desc: {
      en: 'A boundary wall around the campus for student safety.',
      hi: 'विद्यार्थियों की सुरक्षा हेतु परिसर के चारों ओर चहारदीवारी।',
    },
  },
] as const

export const admissionContent = {
  process: [
    {
      en: 'Visit the school office or contact us to enquire about admission.',
      hi: 'प्रवेश हेतु पूछताछ के लिए विद्यालय कार्यालय जाएँ या हमसे संपर्क करें।',
    },
    {
      en: 'Collect and fill the admission form with the required details.',
      hi: 'आवश्यक विवरण के साथ प्रवेश फॉर्म प्राप्त करें एवं भरें।',
    },
    {
      en: 'Submit the form along with the required documents (see checklist below).',
      hi: 'फॉर्म को आवश्यक दस्तावेज़ों (नीचे सूची देखें) के साथ जमा करें।',
    },
    {
      en: 'The school verifies the documents and confirms admission.',
      hi: 'विद्यालय दस्तावेज़ों की जाँच कर प्रवेश की पुष्टि करता है।',
    },
  ],
  eligibility: [
    {
      classRange: '1',
      en: 'Minimum age as per Bihar Government / RTE norms. Please confirm the exact age criteria with the school office.',
      hi: 'बिहार सरकार / RTE मानदंडों के अनुसार न्यूनतम आयु। सटीक आयु मानदंड हेतु विद्यालय कार्यालय से संपर्क करें।',
    },
    {
      classRange: '2–8',
      en: 'Transfer Certificate (TC) from the previous school along with the report card of the last class attended.',
      hi: 'पिछले विद्यालय से स्थानांतरण प्रमाण पत्र (TC) एवं अंतिम कक्षा की रिपोर्ट कार्ड।',
    },
    {
      classRange: '9',
      en: 'Passing certificate / report card of Class 8, subject to seat availability.',
      hi: 'कक्षा 8 का उत्तीर्ण प्रमाण पत्र / रिपोर्ट कार्ड, सीट उपलब्धता के अधीन।',
    },
    {
      classRange: '11',
      en: 'Class 10 (Matriculation) mark sheet from BSEB or an equivalent recognised board.',
      hi: 'BSEB या समकक्ष मान्यता प्राप्त बोर्ड से कक्षा 10 (मैट्रिक) की अंकसूची।',
    },
  ],
  documents: [
    { en: 'Birth certificate', hi: 'जन्म प्रमाण पत्र' },
    { en: 'Aadhaar card (student and guardian)', hi: 'आधार कार्ड (विद्यार्थी एवं अभिभावक)' },
    { en: 'Transfer Certificate (TC) from previous school, if applicable', hi: 'पिछले विद्यालय से स्थानांतरण प्रमाण पत्र (TC), यदि लागू हो' },
    { en: 'Previous class mark sheet / report card, if applicable', hi: 'पिछली कक्षा की अंकसूची / रिपोर्ट कार्ड, यदि लागू हो' },
    { en: 'Caste certificate, if applicable', hi: 'जाति प्रमाण पत्र, यदि लागू हो' },
    { en: 'Income certificate, if applying for scholarship schemes', hi: 'छात्रवृत्ति योजना हेतु आवेदन करने पर आय प्रमाण पत्र' },
    { en: 'Passport-size photographs', hi: 'पासपोर्ट आकार की तस्वीरें' },
    { en: 'Residence proof', hi: 'निवास प्रमाण' },
  ],
  feeRows: [
    { head_en: 'Tuition fee', head_hi: 'शिक्षण शुल्क', value_en: 'Free (Government School)', value_hi: 'निःशुल्क (सरकारी विद्यालय)' },
    { head_en: 'Admission fee', head_hi: 'प्रवेश शुल्क', value_en: 'To be updated', value_hi: 'अद्यतन किया जाना है' },
    { head_en: 'Examination fee', head_hi: 'परीक्षा शुल्क', value_en: 'To be updated', value_hi: 'अद्यतन किया जाना है' },
    {
      head_en: 'Textbooks',
      head_hi: 'पाठ्यपुस्तकें',
      value_en: 'Provided free under Government scheme (subject to availability)',
      value_hi: 'सरकारी योजना के तहत निःशुल्क प्रदान (उपलब्धता के अधीन)',
    },
  ],
  importantDates: [
    { label_en: 'Admission form distribution begins', label_hi: 'प्रवेश फॉर्म वितरण प्रारंभ', date: 'To be announced' },
    { label_en: 'Last date for submission', label_hi: 'जमा करने की अंतिम तिथि', date: 'To be announced' },
    { label_en: 'Merit list / confirmation', label_hi: 'मेधा सूची / पुष्टि', date: 'To be announced' },
    { label_en: 'Session begins', label_hi: 'सत्र प्रारंभ', date: 'To be announced' },
  ],
  faq: [
    {
      q_en: 'What is the medium of instruction?',
      q_hi: 'शिक्षा का माध्यम क्या है?',
      a_en: 'The medium of instruction is Hindi, with English taught as a subject.',
      a_hi: 'शिक्षा का माध्यम हिंदी है, तथा अंग्रेज़ी एक विषय के रूप में पढ़ाई जाती है।',
    },
    {
      q_en: 'Which classes does the school offer?',
      q_hi: 'विद्यालय में कौन-कौन सी कक्षाएँ हैं?',
      a_en: 'The school offers Class 1 to Class 12, including Science, Commerce and Arts streams at the senior secondary level.',
      a_hi: 'विद्यालय में कक्षा 1 से कक्षा 12 तक शिक्षा उपलब्ध है, जिसमें उच्चतर माध्यमिक स्तर पर विज्ञान, वाणिज्य एवं कला संकाय शामिल हैं।',
    },
    {
      q_en: 'Is there a school bus or transport facility?',
      q_hi: 'क्या विद्यालय बस या परिवहन सुविधा उपलब्ध है?',
      a_en: 'Please contact the school office for current information on transport arrangements.',
      a_hi: 'परिवहन व्यवस्था की वर्तमान जानकारी हेतु कृपया विद्यालय कार्यालय से संपर्क करें।',
    },
    {
      q_en: 'Whom do I contact for admission-related queries?',
      q_hi: 'प्रवेश संबंधी प्रश्नों हेतु किससे संपर्क करें?',
      a_en: 'You can call, email, or visit the school office directly — see the Contact page for details.',
      a_hi: 'आप सीधे विद्यालय कार्यालय को कॉल, ईमेल कर सकते हैं या जा सकते हैं — विवरण हेतु संपर्क पृष्ठ देखें।',
    },
  ],
}

export const disclosureSections = [
  {
    title_en: 'School Details',
    title_hi: 'विद्यालय विवरण',
    rows: [
      { label_en: 'Name of School', label_hi: 'विद्यालय का नाम', value: 'Uccha Madhyamik Vidyalaya Adala' },
      { label_en: 'UDISE Code', label_hi: 'UDISE कोड', value: 'XXXXXXXXXXX — to be updated' },
      { label_en: 'School Type', label_hi: 'विद्यालय का प्रकार', value: 'Bihar Government School' },
      { label_en: 'Address', label_hi: 'पता', value: 'Adla, Naubatpur, Patna District, Bihar — 809011' },
      { label_en: 'Classes Offered', label_hi: 'उपलब्ध कक्षाएँ', value: '1 to 12' },
      { label_en: 'Board Affiliation', label_hi: 'बोर्ड संबद्धता', value: 'Bihar School Examination Board (BSEB)' },
    ],
  },
  {
    title_en: 'Management',
    title_hi: 'प्रबंधन',
    rows: [
      { label_en: 'Managed By', label_hi: 'प्रबंधन', value: 'Department of Education, Government of Bihar' },
      { label_en: 'Head of Institution', label_hi: 'संस्था प्रमुख', value: 'To be updated' },
    ],
  },
  {
    title_en: 'Land & Building',
    title_hi: 'भूमि एवं भवन',
    rows: [
      { label_en: 'Area of School Campus', label_hi: 'विद्यालय परिसर का क्षेत्रफल', value: 'To be updated' },
      { label_en: 'Type of Building', label_hi: 'भवन का प्रकार', value: 'To be updated' },
      { label_en: 'No. of Classrooms', label_hi: 'कक्षा-कक्षों की संख्या', value: 'To be updated' },
    ],
  },
  {
    title_en: 'Staff',
    title_hi: 'स्टाफ',
    rows: [
      { label_en: 'No. of Teaching Staff', label_hi: 'शिक्षण स्टाफ की संख्या', value: 'To be updated' },
      { label_en: 'No. of Non-Teaching Staff', label_hi: 'गैर-शिक्षण स्टाफ की संख्या', value: 'To be updated' },
    ],
  },
  {
    title_en: 'Facilities',
    title_hi: 'सुविधाएँ',
    rows: [
      { label_en: 'Library', label_hi: 'पुस्तकालय', value: 'To be updated' },
      { label_en: 'Science Laboratory', label_hi: 'विज्ञान प्रयोगशाला', value: 'To be updated' },
      { label_en: 'Computer Laboratory', label_hi: 'कंप्यूटर प्रयोगशाला', value: 'To be updated' },
      { label_en: 'Drinking Water', label_hi: 'पेयजल', value: 'To be updated' },
      { label_en: 'Toilets (Boys/Girls)', label_hi: 'शौचालय (बालक/बालिका)', value: 'To be updated' },
      { label_en: 'Playground', label_hi: 'खेल का मैदान', value: 'To be updated' },
      { label_en: 'Boundary Wall', label_hi: 'चहारदीवारी', value: 'To be updated' },
      { label_en: 'Mid-Day Meal', label_hi: 'मध्याह्न भोजन', value: 'To be updated' },
    ],
  },
] as const
