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
          color: "#0b0b0b",
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            grab: {
              distance: 140,
              links: { opacity: 0.06 },
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.15,
            },
          },
        },
        particles: {
          number: { value: 45 },
          color: { value: "#ffffff" },
          opacity: { value: 0.05 },
          size: { value: 1 },
          move: {
            enable: true,
            speed: 0.2,
            direction: "right",
            straight: true,
          },
          links: {
            enable: true,
            distance: 180,
            opacity: 0.07,
            width: 1,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
