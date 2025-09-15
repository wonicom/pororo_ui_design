import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

// ===== 캐릭터 로더 =====
function Character() {
  const { scene } = useGLTF("/Pororo.glb");
  return <primitive object={scene} scale={1.5} position={[0, -2.0, 0]} />;
}
useGLTF.preload("/Pororo.glb");

// ===== 배경 로더 =====
function VideoBackground() {
  const { scene } = useThree();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/background.mp4"; // public 폴더에 넣은 Canva 배경 MP4
    video.loop = false;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.play();

    const texture = new THREE.VideoTexture(video);
    texture.encoding = THREE.sRGBEncoding;
    texture.colorSpace = THREE.SRGBColorSpace; // 최신 three.js 버전일 때
    scene.background = texture;

    videoRef.current = video;
  }, [scene]);

  return null;
}

// ===== 눈 효과 =====
function Snow() {
  const flakes = Array.from({ length: 30 }); // 눈송이 30개

  return (
    <div
      className="snow"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",    // 부모 div 전체 덮기
        height: "100%",
        pointerEvents: "none", // 마우스 이벤트 막지 않음
        zIndex: 1,
      }}
    >
      {flakes.map((_, i) => {
        const style = {
          left: `${Math.random() * 100}%`,               // 랜덤 위치
          animationDuration: `${3 + Math.random() * 5}s`, // 속도 랜덤
          fontSize: `${10 + Math.random() * 14}px`,       // 크기 랜덤
        };
        return (
          <div key={i} className="snowflake" style={style}>
            ❄
          </div>
        );
      })}
    </div>
  );
}


// ===== 채팅창 컴포넌트 =====
function ChatBox() {
  const [messages, setMessages] = useState([
    { from: "pororo", text: "안녕! 나는 뽀로로야 👋", time: "오후 3:20" },
    { from: "me", text: "반가워!", time: "오후 3:21" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input, time: "오후 3:22" }]);
    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#f3f4f6",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: "bold",
          textAlign: "center",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        Pororo Chat
      </div>

      {/* 메시지 영역 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
              marginBottom: "0.8rem",
            }}
          >
            {/* Pororo 프로필 */}
            {msg.from === "pororo" && (
              <img
                src="/pororo-icon.png"
                alt="Pororo"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                }}
              />
            )}
            <div>
              <div
                style={{
                  background: msg.from === "me" ? "#2563eb" : "white",
                  color: msg.from === "me" ? "white" : "black",
                  padding: "0.6rem 1rem",
                  borderRadius: "1rem",
                  maxWidth: "65%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {msg.text}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  marginTop: "0.2rem",
                  textAlign: msg.from === "me" ? "right" : "left",
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #e5e7eb",
          padding: "0.5rem",
          background: "white",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            borderRadius: "1.5rem",
            border: "1px solid #d1d5db",
            outline: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          style={{
            marginLeft: "0.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "1.5rem",
            padding: "0 1.2rem",
            fontWeight: "bold",
          }}
          onClick={sendMessage}
        >
          전송
        </button>
      </div>
    </div>
  );
}

// ===== 메인 앱 =====
export default function App() {
  return (
    <>
      {/* 전체 레이아웃 */}
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          display: "grid",
          gridTemplateColumns: "500px 1fr",
        }}
      >
        {/* 왼쪽 채팅창 */}
        <ChatBox />

        {/* 오른쪽 3D 씬 */}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Snow />
          <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
            <VideoBackground />
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <hemisphereLight
              skyColor={"#ffffff"}
              groundColor={"#aaaaaa"}
              intensity={0.8}
            />
            <Character />
            <OrbitControls target={[0, 0.5, 0]} enableZoom={false} />
          </Canvas>
        </div>
      </div>

      {/* ✅ 오른쪽 상단 고정 위젯 (말풍선 꼬리 포함) */}
      <div
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "1.5rem",
          padding: "1rem 1.5rem",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 9999,
          fontWeight: "bold",
          position: "fixed",
        }}
      >
        {/* 날씨 아이콘 */}
        <span style={{ fontSize: "1.8rem" }}>❄️</span>

        {/* 텍스트 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1rem", color: "#374151" }}>
            오늘은 눈이 와요
          </span>
          <span style={{ fontSize: "1.4rem", color: "#2563eb" }}>3℃</span>
        </div>

        {/* 현재 시간 */}
        <span style={{ color: "#111827" }}>
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* 꼬리 (삼각형) */}
        <div
          style={{
            position: "absolute",
            bottom: "-12px",
            right: "20px",
            width: "0",
            height: "0",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "12px solid rgba(255,255,255,0.95)",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.15))",
          }}
        />
      </div>
    </>
  );
}



