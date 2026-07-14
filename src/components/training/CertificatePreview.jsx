import certificateTemplate from '../../assets/certificate-template.png';

const formatCompletionDate = (date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);

export function CertificatePreview({
  studentName,
  courseName,
  validationId,
}) {
  const completionDate = formatCompletionDate(new Date());

  return (
    <div className="certificate-preview-wrapper certificate-print-area">
      <article className="certificate-sheet certificate-preview" aria-label="Pré-visualização do certificado">
        <img
          className="certificate-template"
          src={certificateTemplate}
          alt="Certificado"
        />

        <div className="certificate-preview-content">
          <p className="certificate-intro">Certificamos que</p>
          <h2 className="certificate-student-name">
            {studentName || 'Nome não informado'}
          </h2>
          <p className="certificate-body-text">concluiu com sucesso o curso</p>
          <h3 className="certificate-course-name">{courseName}</h3>
          <p className="certificate-workload">com carga horária total de 30 minutos.</p>
          <p className="certificate-date">{completionDate}</p>

          <div className="certificate-signature">
            <span className="signature-line" aria-hidden="true" />
            <p className="signature-company">Light Serviços de Eletricidade S.A.</p>
          </div>
        </div>

        <p className="certificate-validation">ID de validação: {validationId}</p>
      </article>
    </div>
  );
}
