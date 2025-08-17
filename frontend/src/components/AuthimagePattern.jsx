import { useState } from "react";
import {
  User,
  MessageSquare,
  Lock,
  Shield,
  Smile,
  Heart,
  Globe,
  Bell,
  Star,
} from "lucide-react";

// Icons with labels
const icons = [
  { icon: User, label: "User" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Lock, label: "Secure" },
  { icon: Shield, label: "Privacy" },
  { icon: Smile, label: "Smile" },
  { icon: Heart, label: "Love" },
  { icon: Globe, label: "Explore" },
  { icon: Bell, label: "Alerts" },
  { icon: Star, label: "Favorites" },
];

const AuthImagePattern = ({ title, subtitle }) => {
  const [bubbles, setBubbles] = useState([]);
  const [activeBoxes, setActiveBoxes] = useState([]);

  const handleBoxClick = (index) => {
    const { icon: Icon } = icons[index];
    const id = Date.now() + Math.random();

    // Toggle selected box color
    setActiveBoxes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // unselect
        : [...prev, index] // select
    );

    // Bubble animation
    setBubbles((prev) => [...prev, { id, Icon }]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 2000);
  };

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      <div className="max-w-md text-center z-10">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {icons.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              onClick={() => handleBoxClick(i)}
              title={label}
              className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center transition-transform duration-300 hover:scale-105 ${
                activeBoxes.includes(i)
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Icon className="size-6" />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>

      {/* Floating Bubbles */}
      {bubbles.map(({ id, Icon }) => (
        <div
          key={id}
          className="absolute bottom-16 left-1/2 animate-reaction-bubble pointer-events-none"
          style={{
            transform: `translateX(${Math.random() * 150 - 75}px)`,
          }}
        >
          <div className="bg-white rounded-full p-2 shadow-lg animate-scale-fade">
            <Icon className="text-primary size-6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthImagePattern;
