# Поставување на галеријата на заедницата

Галеријата користи Supabase за кориснички сметки, фотографии и објави. Посетителите треба да направат профил и да се најават за да испратат мотор или проект. Објавата останува скриена додека не ја одобри модератор од Spectracustoms.

## 1. Креирај Supabase проект

1. Креирај проект во Supabase.
2. Во **SQL Editor** отвори и изврши ја датотеката [`community.sql`](./community.sql).
3. Во **Authentication → Providers** овозможи најавување со е-пошта и потврда на е-поштата.
4. Во **Authentication → URL Configuration** постави го **Site URL** на главниот домен на сајтот и додај ги продукциската адреса и локалната адреса `http://localhost:5173/**` во дозволените **Redirect URLs**.
5. Во **Project Settings → API** копирај ги **Project URL** и јавниот `anon`/`publishable` key. **Не користи `service_role` key на веб-сајтот.**

SQL-от создава приватен `community-photos` bucket. Полисите дозволуваат JPEG/PNG/WebP фотографии до 8 MB, ги ограничуваат прикачувањата на сопственикот на сметката и дозволуваат јавен приказ само по одобрување.

## 2. Поврзи го сајтот со Cloudflare Pages

Cloudflare ја хостира веб-страницата, а Supabase останува базата за корисници, податоци и фотографии. Додај ги податоците за Supabase во build-от на Cloudflare Pages:

1. Во Cloudflare отвори **Workers & Pages** и избери го проектот за сајтот.
2. Оди во **Settings → Environment variables**.
3. За **Production** додај ги овие две вредности:

   | Име | Вредност |
   | --- | --- |
   | `VITE_SUPABASE_URL` | **Project URL** од Supabase |
   | `VITE_SUPABASE_ANON_KEY` | јавниот `anon`/`publishable` key од Supabase |

4. Ако сакаш да ја тестираш галеријата на preview домените, додај ги истите вредности и за **Preview**.
5. Провери ги Cloudflare Pages build поставките: **Build command** `npm run build`, **Build output directory** `dist`, **Root directory** празно (коренот на repository-то).
6. Зачувај ги промените и направи нов **Deploy** / повторен build. Стар deploy нема да ги вклучи новите environment variables.
7. Во Supabase отвори **Authentication → URL Configuration** и додај го точниот Cloudflare production домен во **Redirect URLs**, на пример `https://tvoj-proekt.pages.dev/**`. Ако користиш сопствен домен, додај го и него, на пример `https://tvoj-domen.mk/**`. Додај preview адреси само ако ги користиш, на пример `https://*.tvoj-proekt.pages.dev/**`.

Имињата мора да бидат точно `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`; Vite ги чита при build. Променливите со префикс `VITE_` се вградуваат во јавниот JavaScript bundle, затоа внесувај само јавен anon/publishable key — никогаш `service_role` key.

За локално тестирање, копирај го `.env.example` во `.env.local`, внеси ги истите две `VITE_` променливи и рестартирај го Vite.

## Други платформи

За **GitHub Pages**, во GitHub отвори **Settings → Secrets and variables → Actions** и додај:

- Variable `SUPABASE_URL` — Project URL од Supabase.
- Secret `SUPABASE_ANON_KEY` — јавниот anon/publishable key.

Workflow-от автоматски ги користи при следниот build. За **Vercel**, додај ги `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` во **Project Settings → Environment Variables**, па направи redeploy.

## 3. Додели модератор

1. Направи кориснички профил на сајтот и потврди ја е-поштата.
2. Во **Supabase → Authentication → Users** копирај го UUID на твојот корисник.
3. Во SQL Editor изврши ја командата со копираниот UUID:

   ```sql
   insert into public.community_admins (user_id)
   values ('UUID-НА-ТВОЈОТ-ПРОФИЛ')
   on conflict (user_id) do nothing;
   ```

Одјави се и најави се повторно. Во галеријата ќе се појави панелот за одобрување или одбивање пријавени мотори. Само сметки додадени во `community_admins` имаат право да модерираат.

## Приватност и одобрување

Формата бара согласност за јавно прикажување на фотографијата и избраните информации доколку објавата биде одобрена. Е-поштата никогаш не се прикажува. Непотврдените и одбиените објави не се дел од јавната галерија.
