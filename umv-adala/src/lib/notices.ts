import type { Notice } from '@/types/domain'

/** Resolve view/download URLs for a notice attachment stored on Google Drive. */
export function getNoticeAttachmentUrls(notice: Pick<Notice, 'attachment_url' | 'attachment_download_url' | 'driveFileId'>) {
  const viewUrl =
    notice.attachment_url ||
    (notice.driveFileId ? `https://drive.google.com/file/d/${notice.driveFileId}/view?usp=sharing` : null)

  const downloadUrl =
    notice.attachment_download_url ||
    (notice.driveFileId ? `https://drive.google.com/uc?export=download&id=${notice.driveFileId}` : null) ||
    viewUrl

  return { viewUrl, downloadUrl }
}

/** URL suitable for embedding a PDF in an iframe (Google Drive preview or direct file). */
export function getPdfEmbedUrl(notice: Pick<Notice, 'attachment_url' | 'attachment_download_url' | 'driveFileId'>) {
  const fileId =
    notice.driveFileId ||
    notice.attachment_url?.match(/\/d\/([^/]+)/)?.[1] ||
    notice.attachment_download_url?.match(/[?&]id=([^&]+)/)?.[1]

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }

  const { downloadUrl } = getNoticeAttachmentUrls(notice)
  return downloadUrl
}

export function isPdfAttachment(notice: Pick<Notice, 'attachment_filename' | 'attachment_url'>) {
  const name = notice.attachment_filename?.toLowerCase() || notice.attachment_url?.toLowerCase() || ''
  return name.endsWith('.pdf')
}

export const ACCEPTED_NOTICE_FILE_TYPES = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp'
