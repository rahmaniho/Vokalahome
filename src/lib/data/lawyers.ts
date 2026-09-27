import type { Lawyer } from '@/types';

export const lawyers: Lawyer[] = [
  {
    slug: 'ali-keshavarz-najafi', name: 'علی کشاورز نجفی', role: 'مدیر مؤسسه و وکیل پایه یک', specialty: 'پرونده‌های حقوقی و تجاری',
    tags: ['قراردادها', 'املاک', 'تجاری'], experience: '۱۴+ سال تجربه', image: '/images/lawyers/manager-portrait.jpg',
    bio: 'وکیل پایه یک دادگستری و عضو کانون وکلای قزوین با تمرکز بر تحلیل دقیق، راهکار روشن و پیگیری مسئولانه. تصویر فعلی، تصویر پیشنهادی است و باید با پرتره رسمی جایگزین شود.',
    education: ['کارشناسی ارشد [گرایش حقوقی]', 'عضو کانون وکلای قزوین', '[شماره پروانه وکالت]'],
  },
  { slug: 'family-specialist', name: '[نام وکیل خانواده]', role: 'وکیل پایه یک دادگستری', specialty: 'دعاوی خانواده', tags: ['خانواده', 'حضانت', 'مهریه'], experience: '[سابقه] سال', bio: '[بیوگرافی حرفه‌ای وکیل پس از دریافت اطلاعات تکمیل می‌شود.]', education: ['[مدرک و دانشگاه]', '[شماره پروانه]'], placeholder: true },
  { slug: 'criminal-specialist', name: '[نام وکیل کیفری]', role: 'وکیل پایه یک دادگستری', specialty: 'دعاوی کیفری', tags: ['کیفری', 'جرایم مالی', 'دادسرا'], experience: '[سابقه] سال', bio: '[بیوگرافی حرفه‌ای وکیل پس از دریافت اطلاعات تکمیل می‌شود.]', education: ['[مدرک و دانشگاه]', '[شماره پروانه]'], placeholder: true },
  { slug: 'property-specialist', name: '[نام وکیل ملکی]', role: 'وکیل پایه یک دادگستری', specialty: 'املاک و ثبت', tags: ['املاک', 'ثبت', 'قرارداد'], experience: '[سابقه] سال', bio: '[بیوگرافی حرفه‌ای وکیل پس از دریافت اطلاعات تکمیل می‌شود.]', education: ['[مدرک و دانشگاه]', '[شماره پروانه]'], placeholder: true },
  { slug: 'business-specialist', name: '[نام وکیل تجاری]', role: 'مشاور حقوقی کسب‌وکار', specialty: 'شرکت‌ها و تجارت', tags: ['شرکت‌ها', 'قرارداد', 'مطالبات'], experience: '[سابقه] سال', bio: '[بیوگرافی حرفه‌ای وکیل پس از دریافت اطلاعات تکمیل می‌شود.]', education: ['[مدرک و دانشگاه]', '[شماره پروانه]'], placeholder: true },
  { slug: 'administrative-specialist', name: '[نام وکیل اداری]', role: 'وکیل پایه یک دادگستری', specialty: 'دیوان عدالت اداری', tags: ['دیوان', 'مالیاتی', 'استخدامی'], experience: '[سابقه] سال', bio: '[بیوگرافی حرفه‌ای وکیل پس از دریافت اطلاعات تکمیل می‌شود.]', education: ['[مدرک و دانشگاه]', '[شماره پروانه]'], placeholder: true },
];

export const getLawyer = (slug: string) => lawyers.find((item) => item.slug === slug);
