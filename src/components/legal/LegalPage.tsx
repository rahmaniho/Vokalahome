import { PageHero } from '@/components/layout/PageHero';
import { Alert } from '@/components/ui/Alert';

type Section = { title: string; paragraphs: string[] };

/** قالب مشترک صفحات حقوقی سایت (حریم خصوصی، شرایط استفاده، سلب مسئولیت). */
export function LegalPage({
  title,
  description,
  sections,
  href,
}: {
  title: string;
  description: string;
  sections: Section[];
  href: string;
}) {
  return (
    <>
      <PageHero
        eyebrow="اسناد حقوقی وب‌سایت"
        title={title}
        description={description}
        crumbs={[{ label: title, href }]}
      />

      <article className="section-space">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-10">
            <Alert tone="warning" className="mb-8">
              آخرین به‌روزرسانی: ۵ مهر ۱۴۰۵ — متن حاضر نسخهٔ پیشنهادی است و پیش از انتشار نهایی باید توسط مدیر مؤسسه
              بازبینی و تأیید شود.
            </Alert>

            <div className="prose-fa">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
