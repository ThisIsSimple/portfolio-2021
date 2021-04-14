import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { data as iconData } from "../../data/icon";

const STATIC_DENSITY = 1000;

const LogoContainer = () => {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const [constraints, setContraints] = useState();
  const [scene, setScene] = useState();

  const handleResize = () => {
    setContraints(boxRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    let Engine = Matter.Engine;
    let Runner = Matter.Runner;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let MouseConstraint = Matter.MouseConstraint;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current,
      engine,
      canvas: canvasRef.current,
      options: {
        width: 100,
        height: 500,
        background: "rgba(0, 0, 0, 0.95)",
        wireframes: false,
      },
    });

    // Static Walls
    const floor = Bodies.rectangle(150, 300, 300, 20, { isStatic: true });
    const ceiling = Bodies.rectangle(150, 300, 300, 20, { isStatic: true });
    const leftWall = Bodies.rectangle(150, 300, 300, 20, { isStatic: true });
    const rightWall = Bodies.rectangle(150, 300, 300, 20, { isStatic: true });

    World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Static Name on Center

    const name = Bodies.rectangle(0, 0, 531, 123, {
      isStatic: true,
      render: {
        sprite: {
          texture: "./logo/nickname.svg",
          xScale: 0.5,
          yScale: 0.5,
        }
      }
    });

    Matter.Body.scale(name, 0.5, 0.5);

    World.add(engine.world, [name]);

    const initialConstraints = boxRef.current.getBoundingClientRect();

    const { width, height } = initialConstraints;

    const iconSize = 48;
    iconData.map((icon) => {
      const ball = Bodies.circle(width / 2, 0, iconSize * icon.scale, {
        label: icon.name,
        restitution: 0.9,
        render: {
          fillStyle: "black",
          lineWidth: 10,
          sprite: {
            texture: icon.image,
            xScale: iconSize / 512 * 2 * icon.scale,
            yScale: iconSize / 512 * 2 * icon.scale,
          },
        },
      });

      World.add(engine.world, [ball]);
    });

    let mouseConstraint = MouseConstraint.create(engine);
    World.add(engine.world, [mouseConstraint]);

    Runner.run(engine);
    Render.run(render);

    setContraints(initialConstraints);
    setScene(render);

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints;

      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;

      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];
      const ceiling = scene.engine.world.bodies[1];
      const leftWall = scene.engine.world.bodies[2];
      const rightWall = scene.engine.world.bodies[3];

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      });

      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY },
      ]);

      Matter.Body.setPosition(ceiling, {
        x: width / 2,
        y: 0 - STATIC_DENSITY / 2,
      });

      Matter.Body.setVertices(ceiling, [
        { x: 0, y: 0 - STATIC_DENSITY },
        { x: width, y: 0 - STATIC_DENSITY },
        { x: width, y: 0 },
        { x: 0, y: 0 },
      ]);

      Matter.Body.setPosition(leftWall, {
        x: 0 - STATIC_DENSITY / 2,
        y: height / 2,
      });

      Matter.Body.setVertices(leftWall, [
        { x: 0 - STATIC_DENSITY, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: height },
        { x: 0 - STATIC_DENSITY, y: height },
      ]);

      Matter.Body.setPosition(rightWall, {
        x: width + STATIC_DENSITY / 2,
        y: height / 2,
      });

      Matter.Body.setVertices(rightWall, [
        { x: width, y: 0 },
        { x: width + STATIC_DENSITY, y: 0 },
        { x: width + STATIC_DENSITY, y: height },
        { x: width, y: height },
      ]);

      // Dynamically update name
      const name = scene.engine.world.bodies[4];

      Matter.Body.setPosition(name, {
        x: width / 2,
        y: height / 2,
      })
    }
  }, [scene, constraints]);

  return (
    <div ref={boxRef} style={{ width: "100vw", height: "100vh" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LogoContainer;
