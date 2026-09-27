// تعطیلات رسمی سال ۱۴۰۵؛ پیش از استفاده در سال‌های بعد با تقویم رسمی همان سال بازبینی شود.
// مرجع گردآوری نسخه فعلی: https://www.bahesab.ir/time/1405/
export const holidays = [
  { date: '1405/01/01', title: 'نوروز و عید سعید فطر', type: 'official' },
  { date: '1405/01/02', title: 'نوروز و تعطیل عید فطر', type: 'official' },
  { date: '1405/01/03', title: 'عید نوروز', type: 'official' },
  { date: '1405/01/04', title: 'عید نوروز', type: 'official' },
  { date: '1405/01/12', title: 'روز جمهوری اسلامی', type: 'official' },
  { date: '1405/01/13', title: 'روز طبیعت', type: 'official' },
  { date: '1405/01/25', title: 'شهادت امام جعفر صادق (ع)', type: 'official' },
  { date: '1405/03/06', title: 'عید سعید قربان', type: 'official' },
  { date: '1405/03/14', title: 'رحلت امام خمینی و عید غدیر', type: 'official' },
  { date: '1405/03/15', title: 'قیام پانزده خرداد', type: 'official' },
  { date: '1405/04/03', title: 'تاسوعای حسینی', type: 'official' },
  { date: '1405/04/04', title: 'عاشورای حسینی', type: 'official' },
  { date: '1405/05/13', title: 'اربعین حسینی', type: 'official' },
  { date: '1405/05/21', title: 'رحلت پیامبر و شهادت امام حسن (ع)', type: 'official' },
  { date: '1405/05/22', title: 'شهادت امام رضا (ع)', type: 'official' },
  { date: '1405/05/30', title: 'شهادت امام حسن عسکری (ع)', type: 'official' },
  { date: '1405/06/08', title: 'ولادت پیامبر و امام جعفر صادق (ع)', type: 'official' },
  { date: '1405/08/22', title: 'شهادت حضرت فاطمه زهرا (س)', type: 'official' },
  { date: '1405/10/02', title: 'ولادت امام علی (ع) و روز پدر', type: 'official' },
  { date: '1405/10/16', title: 'مبعث پیامبر اکرم (ص)', type: 'official' },
  { date: '1405/11/04', title: 'ولادت حضرت قائم (عج)', type: 'official' },
  { date: '1405/11/22', title: 'پیروزی انقلاب اسلامی', type: 'official' },
  { date: '1405/12/09', title: 'شهادت امام علی (ع)', type: 'official' },
  { date: '1405/12/19', title: 'عید سعید فطر', type: 'official' },
  { date: '1405/12/20', title: 'تعطیل به مناسبت عید فطر', type: 'official' },
  { date: '1405/12/29', title: 'ملی شدن صنعت نفت', type: 'official' },
] as const;

// در Date.getDay، عدد ۵ برابر جمعه است.
export const weeklyHolidays = [5];
