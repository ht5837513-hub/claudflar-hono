# السكرتير (claudflar-hono)

سكرتير شخصي ومنظّم أعمال، مبني على **Hono** ويعمل على **Cloudflare Workers** مع قاعدة بيانات **D1**. واجهة ويب واحدة خفيفة (RTL، عربي) تفتح من متصفح الموبايل مباشرة، بدون تطبيق منفصل.

## المزايا

- **شخصي**: مهام (Tasks) بأولوية وتاريخ استحقاق، وملاحظات (Notes).
- **أعمال**: عملاء (Customers) وطلبات (Orders) بحالة تتبع (قيد الانتظار → مؤكد → تم الشحن → تم التسليم).
- شاشة رئيسية بملخص سريع: مهام اليوم، المتأخرة، الطلبات قيد التنفيذ، عدد العملاء.
- حماية بسيطة برمز دخول واحد (Bearer token) يُحفظ محلياً في المتصفح.

## البنية

```
src/
  index.ts          نقطة الدخول + تركيب المسارات
  types.ts          الأنواع المشتركة
  middleware/auth.ts تحقق رمز الدخول
  routes/           tasks, notes, customers, orders, summary (CRUD عبر D1)
  views/dashboard.ts واجهة الصفحة الواحدة (HTML+CSS+JS مضمّنة)
migrations/0001_init.sql  مخطط قاعدة البيانات
```

## التشغيل محلياً

```bash
npm install
cp .dev.vars.example .dev.vars   # وحدد APP_TOKEN فيه
wrangler d1 create claudflar-db  # انسخ database_id الناتج إلى wrangler.toml
npm run db:migrate:local
npm run dev
```

افتح الرابط الذي يطبعه `wrangler dev`، وأدخل نفس قيمة `APP_TOKEN` كرمز دخول.

## النشر على Cloudflare

1. **تسجيل الدخول**: `wrangler login` (يفتح المتصفح لربط حسابك في Cloudflare — مجاني).
2. **إنشاء قاعدة البيانات الفعلية**:
   ```bash
   wrangler d1 create claudflar-db
   ```
   انسخ `database_id` الظاهر في الناتج إلى حقل `database_id` في `wrangler.toml`.
3. **تطبيق المخطط على القاعدة الحقيقية**:
   ```bash
   npm run db:migrate:remote
   ```
4. **ضبط رمز الدخول كسر** (بدلاً من القيمة الافتراضية في `wrangler.toml`):
   ```bash
   wrangler secret put APP_TOKEN
   ```
5. **النشر**:
   ```bash
   npm run deploy
   ```
   ستحصل على رابط من نوع `https://claudflar-hono.<account>.workers.dev` — هذا هو الرابط الذي تفتحه من الموبايل وتضيفه كاختصار على الشاشة الرئيسية.

## ملاحظة أمنية

الحماية هنا برمز دخول واحد بسيط (مناسب للاستخدام الشخصي الفردي). إذا احتجت لاحقاً مستخدمين متعددين أو صلاحيات متفاوتة (مثلاً موظف يرى الطلبات فقط)، يلزم طبقة مصادقة أقوى (جلسات، أدوار) قبل التوسّع.
