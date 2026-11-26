import React, { useState } from "react";
import "./Afzalliklar.css";

/*
  RASMLAR: oʻzingizning ikonkalaringizni  src/assets/afzallik/  papkasiga joylashtiring
  (kvadrat PNG yoki SVG, taxminan 64×64, bir xil yashil rangda boʻlsa chiroyli chiqadi degan umiddaman).

  Rasmlar tayyor boʻlgach:
   1) quyidagi 4 ta import qatoridagi  //  belgisini olib tashlang,
   2) ITEMS ichida  icon: null  ni  icon: yetkazish  (va hokazo) ga almashtiring.

  Rasm boʻlmasa yoki chiqmasa, oʻrnida emoji koʻrinadi — sahifa buzilmaydi.
*/
 import yetkazish from "../assets/afzallik/yetkazish.png";
 import tolov from "../assets/afzallik/tolov.png";
 import almashtirish from "../assets/afzallik/almashtirish.png";
 import yordam from "../assets/afzallik/yordam.png";

const ITEMS = [
  { id: 1, title: "Tez yetkazib berish", text: "Butun Oʻzbekiston boʻylab", icon: yetkazish,  },
  { id: 2, title: "Xavfsiz toʻlov", text: "100% ishonchli buyurtma", icon: tolov, },
  { id: 3, title: "Oson almashtirish", text: "Muammo boʻlsa, almashtirib beramiz", icon: almashtirish,  },
  { id: 4, title: "24/7 yordam", text: "Savollaringiz uchun Yordamchi-Ai tayyor", icon: yordam,  },
];

export default function Afzalliklar({ items = ITEMS }) {
  const [broken, setBroken] = useState({});

  return (
    <section className="afz-wrap" aria-label="Afzalliklarimiz">
      <div className="afz">
        {items.map((it, k) => (
          <div className="afz-item" key={it.id} style={{ animationDelay: `${k * 90}ms` }}>
            <div className="afz-ic">
              {it.icon && !broken[it.id] ? (
                <img
                  src={it.icon}
                  alt=""
                  onError={() => setBroken((b) => ({ ...b, [it.id]: true }))}
                />
              ) : (
                <span>{it.emoji}</span>
              )}
            </div>
            <div className="afz-tx">
              <b>{it.title}</b>
              <small>{it.text}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}