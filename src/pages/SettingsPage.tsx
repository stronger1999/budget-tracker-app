import { useEffect } from "react";
import Card from "../components/Card";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setLanguage, setTheme } from "../features/settings/settingsSlice";

const translations = {
  en: {
    settings: "Settings",
    subtitle: "Themes and internationalization options.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
  },
  fr: {
    settings: "Paramètres",
    subtitle: "Options de thèmes et d’internationalisation.",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    language: "Langue",
  },
  ar: {
    settings: "الإعدادات",
    subtitle: "خيارات المظهر وتعدد اللغات.",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    language: "اللغة",
  },
};

export default function SettingsPage() {
  const s = useAppSelector((x) => x.settings);
  const d = useAppDispatch();
  const t = translations[s.language];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", s.theme === "dark");
    document.documentElement.dir = s.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = s.language;
  }, [s]);

  return (
    <div>
      <h1 className="text-3xl font-black">{t.settings}</h1>
      <p className="mb-6 text-slate-500">{t.subtitle}</p>

      <Card>
        <label className="mb-4 block">
          {t.theme}
          <select
            className="mt-1 w-full rounded-xl border p-2 dark:bg-slate-900"
            value={s.theme}
            onChange={(e) => d(setTheme(e.target.value as any))}
          >
            <option value="light">{t.light}</option>
            <option value="dark">{t.dark}</option>
          </select>
        </label>

        <label className="block">
          {t.language}
          <select
            className="mt-1 w-full rounded-xl border p-2 dark:bg-slate-900"
            value={s.language}
            onChange={(e) => d(setLanguage(e.target.value as any))}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </label>
      </Card>
    </div>
  );
}