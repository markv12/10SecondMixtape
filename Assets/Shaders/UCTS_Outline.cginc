            uniform float _Outline_Width;
            uniform float4 _Outline_Color;
            uniform float4 _WorldScale;
            
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o = (VertexOutput)0;
                float4 objPos = mul ( unity_ObjectToWorld, float4(0,0,0,1) );
                float4 _ClipCameraPos = mul(UNITY_MATRIX_VP, float4(_WorldSpaceCameraPos.xyz, 1));
                o.pos = UnityObjectToClipPos(float4(v.vertex.xyz + (v.normal/_WorldScale)* _Outline_Width,1));
                return o;
            }
            float4 frag(VertexOutput i) : SV_Target {
                return _Outline_Color;
            }
