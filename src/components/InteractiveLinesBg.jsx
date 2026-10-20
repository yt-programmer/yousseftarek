import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function InteractiveLinesBg() {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      init={particlesInit}
      className="fixed inset-0 -z-10"
      options={{
        fullScreen: {
          enable: true,
          zIndex: -10,
        },
        background: {
          color: "#07080a", // لون خلفية أعمق وأفخم
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            onClick: {
              enable: true,
              mode: "push", // إضافة جسيمات جديدة عند الضغط بالماوس
            },
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.25,
                color: "#10b981", // لون الخط عند التفاعل بالماوس (أخضر زمردي)
              },
            },
            push: {
              quantity: 3,
            },
          },
        },
        particles: {
          number: {
            value: 60, // زيادة عدد الجسيمات قليلاً لتكون الحيوية أفضل
            density: {
              enable: true,
              area: 900,
            },
          },
          color: {
            value: "#10b981", // نقاط باللون الأخضر الزمردي
          },
          opacity: {
            value: 0.25, // شفافية هادئة لا تشتت العين عن المحتوى
          },
          size: {
            value: { min: 1, max: 2.5 }, // تباين في أحجام النقاط لإعطاء عمق بصري
          },
          move: {
            enable: true,
            speed: 0.6, // سرعة حركة هادئة وغير مزعجة
            direction: "none",
            random: true,
            straight: false, // حركة طبيعية في كل الاتجاهات
            outModes: {
              default: "out",
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.05, // خطوط شبكية شفافة جداً في الخلفية
            width: 1,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
