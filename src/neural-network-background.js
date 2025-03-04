import React, { useRef, useEffect } from 'react';

function NeuralNetworkBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePosition = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef(null);
  const isDarkTheme = useRef(false);

  // Configuration parameters - adjust these for visual/performance balance
  const CONFIG = {
    particleCount: 120,          // Fewer particles = better performance
    particleSize: 1.5,          // Size of each node
    particleColor: '',          // Will be set based on theme
    lineColor: '',              // Will be set based on theme
    attractDistance: 170,       // Maximum distance to draw connections
    mouseInfluenceRadius: 120,  // How far mouse affects particles
    mouseForce: 0.05,           // Strength of mouse influence
    particleSpeed: 1.2,         // Base movement speed
    connectionOpacityFactor: 4, // Adjust line opacity strength
    bounce: true,               // Whether particles bounce off edges
    staticNodes: 5,             // Number of static "anchor" nodes for structure
  };

  // Initialize the particles
  const initParticles = (width, height, isDark) => {
    const newParticles = [];
    const staticPositions = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.2 },
      { x: width * 0.5, y: height * 0.3 },
      { x: width * 0.3, y: height * 0.8 },
      { x: width * 0.7, y: height * 0.7 },
    ];

    // Create static "anchor" nodes
    for (let i = 0; i < CONFIG.staticNodes; i++) {
      if (i < staticPositions.length) {
        newParticles.push({
          x: staticPositions[i].x,
          y: staticPositions[i].y,
          vx: 0,
          vy: 0,
          size: CONFIG.particleSize * 1.5,
          isStatic: true,
          pulsePhase: Math.random() * Math.PI * 2, // For size pulsing effect
          pulseSpeed: 0.03 + Math.random() * 0.02,
        });
      }
    }

    // Create regular moving particles
    for (let i = 0; i < CONFIG.particleCount - CONFIG.staticNodes; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
        vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
        size: CONFIG.particleSize * (0.6 + Math.random() * 0.8),
        isStatic: false,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.05 + Math.random() * 0.05,
      });
    }
    
    particles.current = newParticles;
    setColors(isDark);
  };

  // Set colors based on theme
  const setColors = (isDark) => {
    isDarkTheme.current = isDark;
    if (isDark) {
      CONFIG.particleColor = 'rgba(0, 200, 255, 0.9)';   // “neon aqua” um pouco forte
      CONFIG.lineColor    = 'rgba(0, 200, 255, 0.15)';  // linhas bem transparentes
    } else {
      CONFIG.particleColor = 'rgba(0, 150, 255, 0.7)';
      CONFIG.lineColor    = 'rgba(0, 150, 255, 0.1)';
    }
  };
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const handleMouseLeave = () => {
      mousePosition.current = { x: -1000, y: -1000 };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Handle theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.body.parentElement.classList.contains('dark');
          setColors(isDark);
        }
      });
    });
    
    observer.observe(document.body.parentElement, { 
      attributes: true,
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Main animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-initialize particles when canvas is resized
      initParticles(canvas.width, canvas.height, isDarkTheme.current);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseX = mousePosition.current.x;
      const mouseY = mousePosition.current.y;
      
      // Draw connections first (underneath nodes)
      ctx.strokeStyle = CONFIG.lineColor;
      
      // Draw connections between particles
      for (let i = 0; i < particles.current.length; i++) {
        const p1 = particles.current[i];
        
        // Create connections between nearby particles
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < CONFIG.attractDistance) {
            const opacity = (1 - dist / CONFIG.attractDistance) * CONFIG.connectionOpacityFactor;
            
            // Adjust line width based on particle sizes and distance
            const lineWidth = Math.min(p1.size, p2.size) * (0.4 * (1 - dist / CONFIG.attractDistance));
            
            ctx.beginPath();
            ctx.globalAlpha = opacity;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Update and draw particles
      particles.current.forEach(p => {
        // Skip movement for static particles
        if (!p.isStatic) {
          // Update position based on velocity
          p.x += p.vx;
          p.y += p.vy;
          
          // Bounce off the edges
          if (CONFIG.bounce) {
            if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
          } else {
            // Wrap around edges (teleport to other side)
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
          }
          
          // Mouse influence (gentle attraction)
          if (mouseX > 0 && mouseY > 0) {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONFIG.mouseInfluenceRadius) {
              const force = (CONFIG.mouseInfluenceRadius - dist) / CONFIG.mouseInfluenceRadius * CONFIG.mouseForce;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
              
              // Add slight velocity damping to prevent extreme speeds
              const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
              if (speed > 2.5) {
                p.vx = (p.vx / speed) * 2.5;
                p.vy = (p.vy / speed) * 2.5;
              }
            }
          }
          
          // Add very slight random movement for organic feel
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
          
          // Apply damping
          p.vx *= 0.98;
          p.vy *= 0.98;
        }
        
        // Pulsing effect for size
        p.pulsePhase += p.pulseSpeed;
        const pulseFactor = 1 + 0.2 * Math.sin(p.pulsePhase);
        const currentSize = p.size * pulseFactor;
        
        // Draw the particle with a subtle glow effect
        ctx.beginPath();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 3);
        if (isDarkTheme.current) {
          gradient.addColorStop(0, 'rgba(150, 150, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(150, 150, 255, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(70, 70, 140, 0.6)');
          gradient.addColorStop(1, 'rgba(70, 70, 140, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.beginPath();
        ctx.fillStyle = CONFIG.particleColor;
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="neural-network-canvas"
    />
  );
}

export default NeuralNetworkBackground;
