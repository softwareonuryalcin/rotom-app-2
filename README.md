# Seyahat Planlayıcı

Tatil planı oluştur (tarih aralığı → günler), gezi yerlerini önceliklendirerek
günlere dağıt, haritada pinle ve favori yerlerini kaydet. Tüm veriler tarayıcının
`localStorage`'ında saklanır — sunucu gerekmez.

## Özellikler

- **Tatil planı** — ad, açıklama ve **başlangıç/bitiş tarihi**; gün sayısı
  otomatik hesaplanır.
- **Gezi yerleri** — her yere ad, not, **enlem/boylam (lat, lng)** ve
  **öncelik** (Yüksek / Orta / Düşük) verilir.
- **Günlere dağıtma** — her gezi yeri bir güne atanır; **bir güne birden çok
  yer** eklenebilir ve gün içindeki gezi sırası yukarı/aşağı taşınarak
  düzenlenir. Atanmamış yerler ayrı listede tutulur.
- **Etkileşimli harita** — Leaflet + OpenStreetMap üzerinde gezi yerleri
  önceliğe göre renkli pinlerle gösterilir; pin'e tıklayınca ad, öncelik ve
  gün bilgisi açılır.
- **Favoriler** — yıldıza tıklayarak favorile; tüm planlardaki favori yerleri
  tek sekmede gör.
- **Kalıcılık** — veriler `localStorage`'a yazılır, sayfa yenilense de korunur.

## Teknolojiler

React 19 · TypeScript · Vite · Tailwind CSS v4 · Leaflet / react-leaflet

## Proje yapısı

```
src/
  types.ts                # Plan / Place / Priority tipleri
  lib/
    storage.ts            # localStorage okuma-yazma yardımcıları
    plan.ts               # tarih/gün hesabı + öncelik meta verisi
  hooks/usePlans.ts       # tüm durum yönetimi
  components/
    Sidebar.tsx           # plan listesi + yeni plan formu (tarih aralığı)
    PlanDetail.tsx        # günlere göre gezi yerleri + ekleme formu
    MapView.tsx           # Leaflet haritası (öncelik renkli pinler)
    FavoritesPanel.tsx    # favori yerlerin listesi
  App.tsx                 # yerleşim ve sekmeler (Plan / Harita / Favoriler)
```

## Komutlar

```bash
npm run dev      # geliştirme sunucusu
npm run build    # üretim derlemesi
npm run lint     # oxlint
npm run preview  # derlenmiş çıktıyı önizle
```
