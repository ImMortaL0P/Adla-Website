#!/usr/bin/env node
/**
 * Seed official notices from local PDF files into MongoDB + Google Drive.
 * Usage: node scripts/seed-notices.js [--force]
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const { uploadToDrive, deleteFromDrive } = require('../lib/drive');

const PDF_DIR = process.env.NOTICE_PDF_DIR || '/Users/mangalam/Downloads';
const force = process.argv.includes('--force');

const NOTICES = [
  {
    file: 'UMV_Adla_Notice_01_Unit_Test_Result.pdf',
    slug: 'unit-test-result-open-day-2026',
    title_en: 'Unit Test Result Declaration — Open Day',
    title_hi: 'इकाई परीक्षा परिणाम घोषणा — ओपन डे',
    type: 'circular',
    body_en:
      'Dear Parents,\n\nThe results of the I Unit Test will be declared as per the timings given below. Parents are requested to come on time as the results will not be shown after the given timings. It is mandatory to clear all outstanding fees.\n\nOpen Day House:\n• Date: 12th September 2026 (Saturday)\n• Time: 9:00 AM to 11:00 AM\n• Classes: All Classes\n\nCo-operation of all parents is expected.',
    body_hi:
      'प्रिय अभिभावकों,\n\nप्रथम इकाई परीक्षा के परिणाम नीचे दिए गए समयानुसार घोषित किए जाएंगे। अभिभावकों से अनुरोध है कि निर्धारित समय पर विद्यालय में उपस्थित हों; दिए गए समय के बाद परिणाम नहीं दिखाए जाएंगे। सभी बकाया शुल्क का भुगतान अनिवार्य है।\n\nओपन डे:\n• दिनांक: 12 सितंबर 2026 (शनिवार)\n• समय: प्रातः 9:00 से 11:00 बजे तक\n• कक्षाएँ: सभी कक्षाएँ',
  },
  {
    file: 'UMV_Adla_Notice_02_Parent_Teacher_Meeting.pdf',
    slug: 'parent-teacher-meeting-september-2026',
    title_en: 'Parent-Teacher Meeting — September 2026',
    title_hi: 'अभिभावक-शिक्षक सम्मेलन — सितंबर 2026',
    type: 'notice',
    body_en:
      'Dear Parents,\n\nA Parent-Teacher Meeting has been arranged to discuss the academic progress and overall development of students. Parents are requested to attend the meeting personally and interact with the respective class teachers. Students should be accompanied by their parents/guardians wherever required.\n\nMeeting Details:\n• Date: 19th September 2026 (Saturday)\n• Time: 9:30 AM to 12:00 PM\n• Classes: All Classes',
    body_hi:
      'प्रिय अभिभावकों,\n\nविद्यार्थियों की शैक्षणिक प्रगति और समग्र विकास पर चर्चा हेतु अभिभावक-शिक्षक सम्मेलन आयोजित किया गया है। अभिभावकों से अनुरोध है कि वे स्वयं उपस्थित हों और संबंधित कक्षा शिक्षकों से संवाद करें। आवश्यकतानुसार विद्यार्थियों को अभिभावक/अभिभाविका के साथ लाना अपेक्षित है।\n\nसम्मेलन विवरण:\n• दिनांक: 19 सितंबर 2026 (शनिवार)\n• समय: प्रातः 9:30 से 12:00 बजे तक\n• कक्षाएँ: सभी कक्षाएँ',
  },
  {
    file: 'UMV_Adla_Notice_03_Half_Yearly_Exam.pdf',
    slug: 'half-yearly-examination-october-2026',
    title_en: 'Half-Yearly Examination Schedule',
    title_hi: 'अर्धवार्षिक परीक्षा कार्यक्रम',
    type: 'circular',
    body_en:
      'Dear Parents,\n\nThe Half-Yearly Examination will be conducted as per the schedule given below. Students are requested to reach the school at least 15 minutes before the commencement of the examination. Parents are requested to ensure regular attendance and timely preparation of their wards. Students must carry the required stationery and their school identity card.\n\nExamination Schedule:\n• Date: 5th October 2026 (Monday)\n• Time: 9:00 AM to 12:00 PM\n• Classes: All Classes',
    body_hi:
      'प्रिय अभिभावकों,\n\nअर्धवार्षिक परीक्षा नीचे दिए गए कार्यक्रमानुसार आयोजित की जाएगी। विद्यार्थियों से अनुरोध है कि परीक्षा प्रारंभ होने से कम से कम 15 मिनट पूर्व विद्यालय पहुँचें। अभिभावक अपने बच्चों की नियमित उपस्थिति और समय पर तैयारी सुनिश्चित करें। आवश्यक लेखन सामग्री और विद्यालय पहचान पत्र साथ लाना अनिवार्य है।\n\nपरीक्षा कार्यक्रम:\n• दिनांक: 5 अक्टूबर 2026 (सोमवार)\n• समय: प्रातः 9:00 से 12:00 बजे तक\n• कक्षाएँ: सभी कक्षाएँ',
  },
  {
    file: 'UMV_Adla_Notice_04_Holiday.pdf',
    slug: 'school-holiday-2-october-2026',
    title_en: 'School Holiday — 2nd October 2026',
    title_hi: 'विद्यालय अवकाश — 2 अक्टूबर 2026',
    type: 'notice',
    body_en:
      'Dear Parents,\n\nThe school will remain closed on the date mentioned below on account of a scheduled holiday. Regular classes will resume from the next working day as per the usual school timings. Parents are requested to take note of the holiday and plan accordingly.\n\nHoliday Details:\n• Date: 2nd October 2026 (Friday)\n• Classes: All Classes — Holiday',
    body_hi:
      'प्रिय अभिभावकों,\n\nनिर्धारित अवकाश के कारण नीचे दिए गए दिनांक को विद्यालय बंद रहेगा। अगले कार्यदिवस से नियमित कक्षाएँ सामान्य समयानुसार प्रारंभ होंगी। अभिभावकों से अनुरोध है कि अवकाश की सूचना पर ध्यान दें और योजना बनाएं।\n\nअवकाश विवरण:\n• दिनांक: 2 अक्टूबर 2026 (शुक्रवार)\n• कक्षाएँ: सभी कक्षाएँ — अवकाश',
  },
  {
    file: 'UMV_Adla_Notice_05_Fee_Submission.pdf',
    slug: 'fee-submission-september-2026',
    title_en: 'Fee Submission — Last Date 30th September 2026',
    title_hi: 'शुल्क जमा — अंतिम तिथि 30 सितंबर 2026',
    type: 'order',
    body_en:
      'Dear Parents,\n\nParents are requested to clear all outstanding school fees within the due date mentioned below. Kindly ensure that the fee payment is completed on time to avoid any inconvenience. Parents may contact the school office during the prescribed office hours for any fee-related query.\n\nFee Submission:\n• Last Date: 30th September 2026 (Wednesday)\n• Office Hours: 9:30 AM to 4:00 PM\n• Classes: All Classes',
    body_hi:
      'प्रिय अभिभावकों,\n\nअभिभावकों से अनुरोध है कि नीचे दी गई अंतिम तिथि तक सभी बकाया विद्यालय शुल्क का भुगतान कर दें। किसी भी असुविधा से बचने हेतु समय पर शुल्क जमा करना सुनिश्चित करें। शुल्क संबंधी किसी भी प्रश्न हेतु निर्धारित कार्यालय समय में विद्यालय कार्यालय से संपर्क करें।\n\nशुल्क जमा:\n• अंतिम तिथि: 30 सितंबर 2026 (बुधवार)\n• कार्यालय समय: प्रातः 9:30 से शाम 4:00 बजे तक\n• कक्षाएँ: सभी कक्षाएँ',
  },
];

async function seedOne(entry) {
  const filePath = path.join(PDF_DIR, entry.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF not found: ${filePath}`);
  }

  const existing = await Notice.findOne({ slug: entry.slug });
  if (existing && !force) {
    console.log(`  skip  ${entry.slug} (already exists)`);
    return existing;
  }

  if (existing && force) {
    if (existing.driveFileId) {
      try {
        await deleteFromDrive(existing.driveFileId);
      } catch (e) {
        console.warn(`  warn  could not delete old Drive file: ${e.message}`);
      }
    }
    await Notice.deleteOne({ _id: existing._id });
  }

  console.log(`  upload ${entry.file} ...`);
  const uploaded = await uploadToDrive(filePath, entry.file, 'application/pdf');

  const notice = await Notice.create({
    slug: entry.slug,
    title_en: entry.title_en,
    title_hi: entry.title_hi,
    body_en: entry.body_en,
    body_hi: entry.body_hi,
    type: entry.type,
    driveFileId: uploaded.driveFileId,
    attachment_url: uploaded.attachment_url,
    attachment_download_url: uploaded.attachment_download_url,
    attachment_filename: entry.file,
    is_published: true,
  });

  console.log(`  done  ${entry.slug}`);
  return notice;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umv-adala');
  console.log('Connected to MongoDB\n');

  if (force) {
    const trial = await Notice.findOne({ slug: 'trial-1' });
    if (trial) {
      if (trial.driveFileId) await deleteFromDrive(trial.driveFileId).catch(() => {});
      await Notice.deleteOne({ _id: trial._id });
      console.log('Removed trial notice\n');
    }
  }

  for (const entry of NOTICES) {
    await seedOne(entry);
  }

  const count = await Notice.countDocuments({ is_published: true });
  console.log(`\n${count} published notice(s) in database.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
