const FAQ_ITEMS = [
  {
    id: "reliable",
    question: "Etkisepeti güvenilir mi?",
    answer:
      "Etkisepeti, dijital reklam ve kampanya hizmetlerinde şeffaf ve güvenilir süreçler sunar. Panel üzerinden siparişlerinizi takip edebilir; iletişim kanallarımızdan güvenilir yardım alabilirsiniz.",
  },
  {
    id: "support",
    question: "İşlem sonrası destek güvenilir mi?",
    answer:
      "Evet. 7/24 canlı destek ile teslimattan sonra da yanınızdayız; kullanım ve teknik konularda güvenilir yardım sunarız. Kampanya veya hizmete özel süreler için sipariş ekranındaki veya iletişim sayfalarındaki bilgileri kontrol edebilirsiniz.",
  },
  {
    id: "payment",
    question: "Süreç güvenilir şekilde mi işler?",
    answer:
      "Evet. Güvenilir sağlayıcılar ve HTTPS ile korunan bağlantılar kullanılır. Akış sektör standartlarına uygun ve güvenilir biçimde tamamlanır.",
  },
  {
    id: "why",
    question: "Neden Etkisepeti'yi seçmeliyim?",
    answer:
      "Geniş hizmet yelpazesi, net paket seçenekleri ve kullanıcı dostu sipariş akışı ile kampanyalarınızı tek yerden yönetmenizi hedefleriz. İhtiyacınıza uygun çözümleri karşılaştırıp hızlıca satın alabilirsiniz.",
  },
  {
    id: "coupon",
    question: "Kupon kodunu tekrar kullanabilir miyim?",
    answer:
      "Kupon kuralları kampanyaya göre değişir. Çoğu kod tek seferlik veya belirli bir tarih/koşula bağlıdır. Kodu uygulamadan önce kampanya şartlarını mutlaka okuyun; geçerlilik ve kullanım limiti orada belirtilir.",
  },
] as const;

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22.45C8.05 17.31 10 13 17 11C17 11 17 8 17 8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M17 8C17 8 20 8 20 11C20 14 17 17 12 19C12 15 13 11 17 8Z"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>
  );
}

export function FaqSection() {
  return (
    <section
      id="faq"
      className="mt-2 rounded-2xl bg-neutral-50 px-4 py-6 sm:px-5 md:py-7"
      aria-labelledby="faq-heading"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-semibold text-brand-primary shadow-sm"
          aria-hidden
        >
          ?
        </span>
        <h2
          id="faq-heading"
          className="text-base font-semibold tracking-tight text-foreground md:text-lg"
        >
          Sıkça sorulan sorular
        </h2>
      </div>
      <div className="mb-5 h-px w-full bg-neutral-200" role="presentation" />
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {FAQ_ITEMS.map((item) => (
          <li key={item.id}>
            <details className="rounded-lg bg-white shadow-sm ring-1 ring-neutral-200/60 transition open:shadow-md open:ring-brand-primary/25 open:[&_.faq-chevron]:rotate-180 open:[&_.faq-chevron]:text-brand-primary">
              <summary className="flex cursor-pointer list-none items-center gap-0 py-2 pl-3 pr-2 md:pl-4 [&::-webkit-details-marker]:hidden">
                <span className="flex shrink-0 items-center self-start pt-0.5 text-rose-500">
                  <LeafIcon className="h-5 w-5" />
                </span>
                <span
                  className="mx-3 w-px shrink-0 self-stretch bg-neutral-200"
                  aria-hidden
                />
                <span className="min-w-0 flex-1 py-1.5 text-sm font-medium leading-snug text-neutral-800">
                  {item.question}
                </span>
                <span
                  className="faq-chevron flex h-9 w-9 shrink-0 items-center justify-center text-neutral-400 transition duration-200"
                  aria-hidden
                >
                  <i className="fa-solid fa-chevron-down text-xs" />
                </span>
              </summary>
              <div className="border-t border-neutral-100 px-3 pb-3 pt-1 md:px-4">
                <p className="pl-[calc(1.25rem+1px+0.75rem)] text-sm leading-relaxed text-neutral-600 md:pl-[calc(1.25rem+1px+1rem)]">
                  {item.answer}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
