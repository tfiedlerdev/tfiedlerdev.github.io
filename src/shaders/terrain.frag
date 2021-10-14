uniform float u_time;
in vec2 v_uv;
in vec2 global_uv;
uniform vec2 u_size;
      bool isBorder(){
        vec2 m = abs(v_uv - 0.5);
        return m.x>=0.45 || m.y >= 0.45;
      }
      void main(void)
      {
          // TODO: implement metaball visualization
          // set fragColor to set the color of the pixel
          gl_FragColor = isBorder()?vec4(1.):vec4( vec3(v_uv,fract(sin(u_time*3.14))),1.0);


      }