import { useEffect } from "react";
import {
  AlertTriangle,
  BarChart3,
  Blocks,
  Brain,
  CheckCircle2,
  Clock,
  Eye,
  GitBranch,
  Info,
  LayoutGrid,
  Lightbulb,
  Lock,
  Map,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function App() {
  return (
    <div>
      <div
        className="bg-neutral-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
        data-id="dabbf8ce-4075-548c-ba3e-646677352d56"
      >
        <div
          className="flex p-12 flex-col gap-12"
          data-id="fa66eead-cfa9-5467-8efd-7f77a8065365"
        >
          <div
            className="flex justify-between items-center"
            data-id="afed8144-0f69-5b72-b86e-9bd8459d3f6c"
          >
            <div
              className="flex items-center gap-4"
              data-id="3b382ffc-e34c-55d5-afbb-d77826f20b60"
            >
              <div
                className="rounded-lg bg-neutral-200 flex justify-center items-center w-10 h-10"
                data-id="78466db6-b2bb-5428-9386-c166f987e32b"
              >
                <Brain
                  className="size-5 text-neutral-900"
                  data-id="9e3f4aae-0c04-5848-b3a9-f8ee58322d0e"
                />
              </div>
              <span
                className="font-bold text-2xl leading-8 tracking-tight"
                data-id="548a77a8-6729-579b-9cec-a8d4f9c892a1"
              >
                logiq
              </span>
              <Separator
                className="h-6"
                orientation="vertical"
                data-id="703bea3c-7f94-50bf-9210-83abd4ff9bd8"
              />
              <span
                className="font-medium uppercase text-[#a1a1a1] text-sm leading-5 tracking-wide"
                data-id="395df362-7c44-5e57-83a8-a9e102c3984a"
              >
                Design System v1.0
              </span>
            </div>
            <div
              className="flex items-center gap-2"
              data-id="8c05372a-574e-53fc-9128-61bf22d7e10c"
            >
              <Badge
                className="text-xs leading-4"
                variant="outline"
                data-id="790abca2-a53f-5c7b-8c12-10b9e8acf27d"
              >
                Dark Mode
              </Badge>
            </div>
          </div>
          <Separator data-id="8f6633c3-d688-51f5-a7d2-05df84e42f4e" />
          <div
            className="flex flex-col gap-2"
            data-id="636f0db0-90ea-5fd1-ba39-0ab1f6ca9548"
          >
            <h1
              className="leading-tight font-bold text-4xl leading-10 tracking-tight"
              data-id="2f2a936f-d3c0-5395-b7bd-891520c8f767"
            >
              Design System
            </h1>
            <p
              className="max-w-2xl leading-relaxed text-[#a1a1a1] text-lg leading-7"
              data-id="7dfa15e1-366a-5e7e-ac69-e6e3bdc4b8b0"
            >
              The foundational tokens, typography, color palette, and component
              library for logiq — a visual, gamified platform for teaching
              algorithmic reasoning.
            </p>
          </div>
          <div
            className="grid grid-cols-3 gap-8"
            data-id="78681dc6-908c-5a54-8430-4c38db992d92"
          >
            <div
              className="col-span-3"
              data-id="0bf738ec-bb8a-5b57-935b-c3fd57dc686f"
            >
              <h2
                className="font-semibold text-2xl leading-8 tracking-tight mb-6"
                data-id="0fc0cae0-c1f3-5e69-bfd2-8838daec4196"
              >
                Color Palette
              </h2>
              <div
                className="grid grid-cols-2 gap-6"
                data-id="4e0e87ca-1f62-538e-9db6-e7faf314efdb"
              >
                <Card
                  className="border-white/10 border-0 border-solid p-6 gap-4"
                  data-id="1ed14b58-c03f-5c79-ab4f-25f636618177"
                >
                  <CardHeader
                    className="p-0 gap-1"
                    data-id="264930ec-5c96-5cb7-9f11-a90db1d3237f"
                  >
                    <CardTitle
                      className="font-semibold text-base leading-6"
                      data-id="429f4ef7-8362-50a7-8ba6-082e95a68418"
                    >
                      Foundation Colors
                    </CardTitle>
                    <p
                      className="text-[#a1a1a1] text-sm leading-5"
                      data-id="5df95ddf-f39e-5395-a27f-1a4001f0d8ac"
                    >
                      Core surface and text colors used across the interface
                    </p>
                  </CardHeader>
                  <CardContent
                    className="p-0 gap-4"
                    data-id="812f5dbe-ca46-53fa-a3c8-c6bbcdf93d13"
                  >
                    <div
                      className="grid grid-cols-2 gap-4"
                      data-id="3b2f0c9a-6580-5e15-95b7-9944bfd1c5f7"
                    >
                      <div
                        className="flex flex-col gap-2"
                        data-id="1214926f-6a32-5676-bf3d-f99201bb685e"
                      >
                        <div
                          className="rounded-lg bg-neutral-950 border-white/10 border-1 border-solid flex p-2 items-end h-20"
                          data-id="5bbb32b9-bd53-5e53-9a49-f4ebc0b07281"
                        >
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="8e139a85-0899-523c-ad22-07e2bfdcd251"
                          >
                            background
                          </span>
                        </div>
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="a85c3a80-0d85-5e43-8ee6-f1e25bf37c06"
                        >
                          Background
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="6f062bb6-c063-5c77-8ed0-09d37d233948"
                        >
                          oklch(0.145 0 0)
                        </span>
                      </div>
                      <div
                        className="flex flex-col gap-2"
                        data-id="701dcd89-d5e2-51f2-b881-ef1c577ab133"
                      >
                        <div
                          className="rounded-lg bg-neutral-900 border-white/10 border-1 border-solid flex p-2 items-end h-20"
                          data-id="7dca0afe-81f9-57d6-8320-3bc6e138e2c5"
                        >
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="839130af-3a5e-581f-8ce4-66d8a8fb4695"
                          >
                            card
                          </span>
                        </div>
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="7e3f01d1-427f-5443-9a78-dd56a831e9c3"
                        >
                          Card
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="69a8ac21-fd3e-5d87-9a85-b65f048318d0"
                        >
                          oklch(0.205 0 0)
                        </span>
                      </div>
                      <div
                        className="flex flex-col gap-2"
                        data-id="52a7f952-ef8b-5241-b5e7-5557e3c24689"
                      >
                        <div
                          className="rounded-lg bg-neutral-800 border-white/10 border-1 border-solid flex p-2 items-end h-20"
                          data-id="db5742eb-91f4-5d48-8f33-46aa058ce1f9"
                        >
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="ceef808e-3f22-501a-8f4f-a64e94c9b8dc"
                          >
                            secondary
                          </span>
                        </div>
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="dea0b464-c1b0-5943-932e-d628ed0ad38b"
                        >
                          Secondary
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="f5b4802d-f272-55f0-a01f-450ef4672476"
                        >
                          oklch(0.269 0 0)
                        </span>
                      </div>
                      <div
                        className="flex flex-col gap-2"
                        data-id="929f4524-cd9a-5071-b64a-19cae931cd6b"
                      >
                        <div
                          className="rounded-lg bg-neutral-800 border-white/10 border-1 border-solid flex p-2 items-end h-20"
                          data-id="f0faaa43-2213-543f-91f5-c117706d3cf6"
                        >
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="7924a365-cc9d-5e98-8b85-7d1428f222aa"
                          >
                            muted
                          </span>
                        </div>
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="144c6b6a-d38f-5f9d-9419-9115633079ae"
                        >
                          Muted
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="9bebfad7-eee9-531c-b50a-c94e8d978360"
                        >
                          oklch(0.269 0 0)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="border-white/10 border-0 border-solid p-6 gap-4"
                  data-id="b642fb88-90b2-5b86-9d73-bb15f19a31ec"
                >
                  <CardHeader
                    className="p-0 gap-1"
                    data-id="474906d9-b01f-5bab-a5bc-12cc9a1dd3f2"
                  >
                    <CardTitle
                      className="font-semibold text-base leading-6"
                      data-id="7cf7c1ff-db16-5841-b5ae-12827dec93ba"
                    >{`Text & Foreground`}</CardTitle>
                    <p
                      className="text-[#a1a1a1] text-sm leading-5"
                      data-id="85c5fe9d-d114-56aa-b093-f5d4ca311413"
                    >
                      Typography and content color hierarchy
                    </p>
                  </CardHeader>
                  <CardContent
                    className="p-0 gap-4"
                    data-id="7a99b59d-e276-569e-9fab-9a2392a3d2dd"
                  >
                    <div
                      className="flex flex-col gap-4"
                      data-id="7bbb3040-6b06-5436-a188-ad73980b65fa"
                    >
                      <div
                        className="rounded-lg bg-neutral-800/50 flex p-4 items-center gap-4"
                        data-id="33dade39-562d-5982-a3db-8ec6757c126a"
                      >
                        <div
                          className="rounded-lg bg-neutral-50 w-12 h-12"
                          data-id="dbaead92-a3fe-5883-9021-6483e38fed64"
                        />
                        <div
                          className="flex flex-col gap-1"
                          data-id="d64f491d-a864-5d35-9805-5b0a343745d3"
                        >
                          <span
                            className="font-medium text-sm leading-5"
                            data-id="5a66f0d5-4aa8-53ef-84ff-77db2e4a69e3"
                          >
                            Foreground
                          </span>
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="d26905f0-49e4-528e-9d39-8d3cf679718b"
                          >
                            oklch(0.985 0 0)
                          </span>
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="75f66a21-600b-52fc-9150-93ab8fc8b207"
                          >
                            Primary text, headings, body copy
                          </span>
                        </div>
                      </div>
                      <div
                        className="rounded-lg bg-neutral-800/50 flex p-4 items-center gap-4"
                        data-id="a81fd2e2-e2a7-5599-a616-d04973f1389e"
                      >
                        <div
                          className="rounded-lg bg-neutral-200 w-12 h-12"
                          data-id="857b1392-0fa2-5bd9-95f7-64056c80d431"
                        />
                        <div
                          className="flex flex-col gap-1"
                          data-id="28a84519-e553-5fd3-8dfa-d600a77e8940"
                        >
                          <span
                            className="font-medium text-sm leading-5"
                            data-id="644cc59e-3f87-5439-afc7-db5c2e0a873c"
                          >
                            Primary
                          </span>
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="f3ecde8f-b9f1-5a15-aa35-22d903e89992"
                          >
                            oklch(0.922 0 0)
                          </span>
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="5c4702d5-8152-58a3-a419-5af13a000281"
                          >
                            Key actions, highlights, CTA elements
                          </span>
                        </div>
                      </div>
                      <div
                        className="rounded-lg bg-neutral-800/50 flex p-4 items-center gap-4"
                        data-id="d3cf1eea-1619-5cd5-aeb2-45cf8d0eb889"
                      >
                        <div
                          className="rounded-lg bg-[#a1a1a1] w-12 h-12"
                          data-id="3fec5175-ca9d-5ef7-8846-443a48d482fb"
                        />
                        <div
                          className="flex flex-col gap-1"
                          data-id="75610e10-65d6-55be-ac1a-4535c83a653b"
                        >
                          <span
                            className="font-medium text-sm leading-5"
                            data-id="1647ea91-5f3d-55c0-8148-8031dafac4ec"
                          >
                            Muted Foreground
                          </span>
                          <span
                            className="font-mono text-[#a1a1a1] text-xs leading-4"
                            data-id="58f47903-ba61-54b1-b9ea-af437a7ffa8e"
                          >
                            oklch(0.708 0 0)
                          </span>
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="82df9ae7-90ce-5bd7-9ba5-026c370a4721"
                          >
                            Secondary text, labels, captions
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div
              className="col-span-3"
              data-id="c7fc4c5f-a819-50e0-952d-d99c331c33ac"
            >
              <h3
                className="font-semibold text-lg leading-7 mb-4"
                data-id="cb5af4e6-c8e1-5017-803f-7b4f170d00c1"
              >{`Semantic & Chart Colors`}</h3>
              <div
                className="grid grid-cols-5 gap-4"
                data-id="4cfbaf1b-8961-5c48-abc4-282b7828ec9b"
              >
                <div
                  className="flex flex-col gap-2"
                  data-id="22bb207f-cdcd-5534-a875-8085f60da9b5"
                >
                  <div
                    className="rounded-lg flex p-2 items-end h-16"
                    style={{ backgroundColor: "oklch(0.704 0.191 22.216)" }}
                    data-id="3e79f1de-3cfd-5915-aa7e-6fc70e25b53d"
                  >
                    <span
                      className="font-mono text-neutral-50 text-xs leading-4"
                      data-id="746b2472-82d5-5caf-83bd-1eda5aeea73e"
                    >
                      destructive
                    </span>
                  </div>
                  <span
                    className="font-medium text-xs leading-4"
                    data-id="791d27ef-eede-5be6-9dd6-a12565df4bfd"
                  >
                    Destructive / Error
                  </span>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="17596d24-aaad-51f9-940a-668b95fd68cd"
                >
                  <div
                    className="rounded-lg flex p-2 items-end h-16"
                    style={{ backgroundColor: "oklch(0.488 0.243 264.376)" }}
                    data-id="fcc6cef1-8443-5c9f-b197-8d55c57e9c14"
                  >
                    <span
                      className="font-mono text-neutral-50 text-xs leading-4"
                      data-id="32d5770e-b247-53c2-b4a2-f9c54013af31"
                    >
                      chart-1
                    </span>
                  </div>
                  <span
                    className="font-medium text-xs leading-4"
                    data-id="f5fa5dc4-6d51-5a57-929d-23b6d94cda2d"
                  >
                    Indigo / Primary
                  </span>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="f679936f-c8e6-5ad4-b740-e364bfc57788"
                >
                  <div
                    className="rounded-lg flex p-2 items-end h-16"
                    style={{ backgroundColor: "oklch(0.696 0.17 162.48)" }}
                    data-id="decb7d59-114f-55c0-bd3b-0e8179111817"
                  >
                    <span
                      className="font-mono text-neutral-50 text-xs leading-4"
                      data-id="f8896bfb-a00b-555a-ae0d-6bbbb305a041"
                    >
                      chart-2
                    </span>
                  </div>
                  <span
                    className="font-medium text-xs leading-4"
                    data-id="6d9af066-4da5-598b-ac86-cd3dfd366a8b"
                  >
                    Emerald / Success
                  </span>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="bf541808-0a8d-5f5c-896e-e758d228dd0e"
                >
                  <div
                    className="rounded-lg flex p-2 items-end h-16"
                    style={{ backgroundColor: "oklch(0.769 0.188 70.08)" }}
                    data-id="6091b0e6-d35c-5ecd-b70a-93a4e012e76c"
                  >
                    <span
                      className="font-mono text-neutral-50 text-xs leading-4"
                      data-id="bc7c4d01-1aed-5171-9918-6a8eb79b15d2"
                    >
                      chart-3
                    </span>
                  </div>
                  <span
                    className="font-medium text-xs leading-4"
                    data-id="e386a013-4a90-54f1-ba8a-5a05cfb171f9"
                  >
                    Amber / Warning
                  </span>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="acfb9661-69cd-5e31-8209-2344fe4e4f3a"
                >
                  <div
                    className="rounded-lg flex p-2 items-end h-16"
                    style={{ backgroundColor: "oklch(0.627 0.265 303.9)" }}
                    data-id="d3ab41e0-7ddd-5a9f-880b-c9a93f654553"
                  >
                    <span
                      className="font-mono text-neutral-50 text-xs leading-4"
                      data-id="5f524a7d-6d9f-5f5b-84bc-b531b5a4f56c"
                    >
                      chart-4
                    </span>
                  </div>
                  <span
                    className="font-medium text-xs leading-4"
                    data-id="e24852cd-0b28-5c0a-80e2-6f46394980bd"
                  >
                    Violet / Insight
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Separator data-id="a131ffe6-abcd-59d3-8097-a5b672eb8a46" />
          <div
            className="flex flex-col gap-8"
            data-id="b7e16eee-4d14-54e5-b204-f6d274f3c5a7"
          >
            <h2
              className="font-semibold text-2xl leading-8 tracking-tight"
              data-id="ec683b77-f931-548c-9183-2a3ac0deba84"
            >
              Typography Scale
            </h2>
            <div
              className="grid grid-cols-2 gap-8"
              data-id="ad88837b-3339-5919-886b-fc9de967423b"
            >
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-6"
                data-id="defc8301-f73a-537e-be8c-1aa231e0e1ce"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="4de1860e-23d6-5039-98ca-0919b6e26b6e"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="35db63ab-f25e-5b92-bca9-2a1c4e2e1d1f"
                  >
                    Type Scale — Headings
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="8472a0fa-1675-528f-ba88-53af88142df4"
                  >
                    Inter — modern, highly legible sans-serif
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-6"
                  data-id="a38772b2-6399-59a0-95b5-8eb4b031d3ca"
                >
                  <div
                    className="flex flex-col gap-6"
                    data-id="ab243e28-7f6d-59a5-a0fb-171c3099cb64"
                  >
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="558794d7-7f4e-54c3-b301-4625eb2865db"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="ff804dde-656c-5e96-b1c9-20b5b7e3c671"
                      >
                        <h1
                          className="font-bold text-4xl leading-10 tracking-tight"
                          data-id="f24e4430-60d2-5d39-99b1-628ce8bb6011"
                        >
                          H1 — Page Title
                        </h1>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="f0ff9f62-a844-5ed4-8997-d3dd4877ed4d"
                        >
                          40px / 700
                        </span>
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="2506093a-3e88-52ac-8b0a-29bca619709c"
                      >
                        Page titles, challenge titles
                      </span>
                    </div>
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="2585dcd8-0485-5884-8de9-17e45306624d"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="28241bee-317f-5e6e-9aea-7527bcdf698f"
                      >
                        <h2
                          className="font-semibold text-3xl leading-9 tracking-tight"
                          data-id="95010201-c73f-5afd-89f3-a10c5c9e1a1a"
                        >
                          H2 — Section Header
                        </h2>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="521d7c37-f24e-5a5a-8c20-684e55ac256f"
                        >
                          32px / 600
                        </span>
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="93341772-aae8-5640-b6c6-76624e222425"
                      >
                        Section headers, skill cluster titles
                      </span>
                    </div>
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="61637eea-71f0-53b0-a570-c6e50631bcd4"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="2af21749-5b57-599f-8773-29015b0b2b0a"
                      >
                        <h3
                          className="font-semibold text-2xl leading-8"
                          data-id="04d881ca-3f11-561c-94e9-b46dce3b12f6"
                        >
                          H3 — Subsection
                        </h3>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="bb120c4d-5744-5564-8d45-b1f76c9164f7"
                        >
                          24px / 600
                        </span>
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="f072bacd-87f0-5c42-bf9f-50b6dde0f484"
                      >
                        Subsection headers, panel titles
                      </span>
                    </div>
                    <div
                      className="flex flex-col gap-1"
                      data-id="f2b3e83e-4433-5308-98c5-13faf7c4f641"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="9b3986cc-474b-5731-a361-c1bc2e4fb4f5"
                      >
                        <h4
                          className="font-semibold text-xl leading-7"
                          data-id="e9e73f80-9504-513e-9e62-59d229b75b9c"
                        >
                          H4 — Card Title
                        </h4>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="7b11eda2-bba9-5b35-820b-cee91dd66ae5"
                        >
                          20px / 600
                        </span>
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="6813d2e0-8b05-5d77-917b-d752b02d1710"
                      >
                        Card titles, block category headers
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-6"
                data-id="bd7c0126-bc44-5f4f-a024-0c5cf841ff61"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="fcf3c1f8-7f09-5cee-b7b5-fb562a740110"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="881c6dd4-a103-509f-ba11-448e2c64244e"
                  >{`Type Scale — Body & Utility`}</CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="9e7fa2aa-ef83-58d1-85c7-2a00d8e8c347"
                  >
                    Consistent sizing for readability and hierarchy
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-6"
                  data-id="6bb62b2c-530c-5640-b5db-9fe6cd24413e"
                >
                  <div
                    className="flex flex-col gap-6"
                    data-id="af5cdfe9-9695-58af-b7a6-b47086536385"
                  >
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="19114773-8273-5b61-8eb7-c1d468997042"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="726c7156-d262-5544-b2b6-134469996dd4"
                      >
                        <p
                          className="text-base leading-6"
                          data-id="a47d9700-80e5-52ef-987e-267b4b1e4eac"
                        >
                          Body — The quick brown fox jumps over the lazy dog.
                          This is the primary reading size for challenge
                          descriptions and content.
                        </p>
                      </div>
                      <div
                        className="flex mt-1 justify-between items-center"
                        data-id="a307edc3-da7d-5a92-b789-bc7945126bff"
                      >
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="48fd7238-9459-56ea-aa30-c568a09ac2ef"
                        >
                          Body text, challenge descriptions
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="c0286afb-eff3-5422-8d6e-71cff9aeb77c"
                        >
                          16px / 400
                        </span>
                      </div>
                    </div>
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="b6bf70a2-a830-511e-804e-8189660b754a"
                    >
                      <div
                        className="items-baseline flex justify-between"
                        data-id="dc472496-2374-5418-ba9d-51e592542533"
                      >
                        <p
                          className="text-sm leading-5"
                          data-id="460583c3-7934-58a6-a357-655f18c02e95"
                        >
                          Small — Labels, hints, and secondary text that
                          supports the primary content without competing for
                          attention.
                        </p>
                      </div>
                      <div
                        className="flex mt-1 justify-between items-center"
                        data-id="cae8622d-962b-5fc5-84b3-e20c50f850ae"
                      >
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="4c400e78-3483-5ff1-8ded-128716c53b62"
                        >
                          Labels, hints, secondary text
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="03f630af-3041-55d5-8916-11ec9f1de5e3"
                        >
                          14px / 400
                        </span>
                      </div>
                    </div>
                    <div
                      className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-4 flex-col gap-1"
                      data-id="840328bb-1c4b-552b-8a1a-7e4c4de52491"
                    >
                      <p
                        className="text-xs leading-4"
                        data-id="8a239c4a-21ec-5776-b7b8-3d5b00e375dc"
                      >
                        Tiny — Block labels, metadata, timestamps
                      </p>
                      <div
                        className="flex mt-1 justify-between items-center"
                        data-id="73e66fb4-8d32-56ed-ba63-77d48186d08d"
                      >
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="52d51ffa-55c1-5a9a-89bb-fe79282283a6"
                        >
                          Metadata, timestamps
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="cec0dac3-de5b-519c-99e4-78a13a0d633d"
                        >
                          12px / 400
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-col gap-1"
                      data-id="002af756-aff8-5edc-8356-0cc46a89fdf4"
                    >
                      <p
                        className="font-mono text-sm leading-5"
                        style={{ fontFamily: "monospace" }}
                        data-id="e3662e31-9f24-50d6-b4bf-e2c8ff284ad5"
                      >
                        Mono — fn linearSearch(arr, target)
                      </p>
                      <div
                        className="flex mt-1 justify-between items-center"
                        data-id="e8dfc46e-bb92-535f-bb45-c81703bec8e4"
                      >
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="258a37ed-dfe8-5e89-a21d-6d80c64dc27c"
                        >
                          Code elements, block IDs, annotations
                        </span>
                        <span
                          className="font-mono text-[#a1a1a1] text-xs leading-4"
                          data-id="2b429855-65af-592d-b8a5-053a033d9295"
                        >
                          14px / 400 mono
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator data-id="d6bff47b-4116-58e6-a59a-567121c77190" />
          <div
            className="flex flex-col gap-8"
            data-id="fcaa8b03-b780-56b0-8fb6-d4dc40f522f9"
          >
            <h2
              className="font-semibold text-2xl leading-8 tracking-tight"
              data-id="15ede412-77d6-5acd-abc5-6efa27ee29d7"
            >{`Spacing & Layout`}</h2>
            <div
              className="grid grid-cols-3 gap-6"
              data-id="0ecc01d8-84e6-5890-848b-28116f7c7275"
            >
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="1b679aeb-a155-5c60-b736-fe9d0b7b7554"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="9ef58929-d389-5c44-9b97-65d728560cf1"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="3df2f5f9-215f-5488-8339-a12d2af3529f"
                  >
                    Spacing Scale
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="568a7927-02c4-5e42-8f07-06d69a191b4b"
                  >
                    8px base unit system
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="d04544ac-5215-567d-afd9-7ed77b7b68bf"
                >
                  <div
                    className="flex flex-col gap-4"
                    data-id="c13400ec-92e0-5dd0-b666-b5955e47c853"
                  >
                    <div
                      className="flex items-center gap-4"
                      data-id="7b23ed2a-e6e2-51a6-92ba-d200accfa0a8"
                    >
                      <div
                        className="rounded-full bg-neutral-200 w-1 h-4"
                        data-id="b672c506-3280-5a24-978c-9e864aa32a0e"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="6b1c101b-c5e2-55b0-881a-d218f70192e3"
                      >
                        space-1
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="5c53003b-b32b-5f72-ac3e-dad04b2d0c7c"
                      >
                        4px — Tight inline spacing
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="da0b015c-bbc8-5e85-bcdd-331bd7c42fc3"
                    >
                      <div
                        className="rounded-full bg-neutral-200 w-2 h-4"
                        data-id="d1c219b4-3d94-51bb-89dc-13dfdb232c58"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="5713b871-abf5-51bd-973f-1497184bbdd9"
                      >
                        space-2
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="b3154d1e-4de7-516c-96fb-4868cd083a05"
                      >
                        8px — Element gaps
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="7d056a4b-0965-5291-b2f7-b7f18dced44a"
                    >
                      <div
                        className="rounded-sm bg-neutral-200 w-4 h-4"
                        data-id="dfbce1e2-83eb-550d-b2ba-720a16dfe550"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="d713cbb4-7fc8-5e3e-aecf-63c677cc4bdb"
                      >
                        space-4
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="bbb60033-6ab0-5de0-ba97-f0a73eeb052d"
                      >
                        16px — Component padding
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="91d6423d-d278-55d7-80b3-f8e3d924ca0a"
                    >
                      <div
                        className="rounded-sm bg-neutral-200 w-6 h-4"
                        data-id="f3058c34-b5f4-5210-8dce-bc116f7dcf2e"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="1857434f-9228-54bf-9368-cfbf13585cfc"
                      >
                        space-6
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="b3042ce4-cc45-505e-b571-83758aa8f1a7"
                      >
                        24px — Card padding
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="9e9e0c68-873c-558e-9ade-c2e44ae2d2b9"
                    >
                      <div
                        className="rounded-sm bg-neutral-200 w-8 h-4"
                        data-id="b129dca8-fa22-5920-8c5a-cabe983e1630"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="b4545eb4-389b-5add-bfd5-8a9311e22258"
                      >
                        space-8
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="cee68f30-095b-5f60-9bf9-4e13bcafe8ec"
                      >
                        32px — Section spacing
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="2534e458-3a99-57a0-aa82-0391db233347"
                    >
                      <div
                        className="rounded-sm bg-neutral-200 w-12 h-4"
                        data-id="5833de8d-70e7-56bd-b6c5-840517c4e046"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4 w-16"
                        data-id="f7cff80a-8e10-5b87-8f9e-0097016d046f"
                      >
                        space-12
                      </span>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="dec46a67-8082-52f1-9596-b6f769adc982"
                      >
                        48px — Page margins
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="3173171d-98f4-527a-9fda-8be88eaf4c51"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="cb79f57e-8860-555b-850e-172171dc334b"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="cb49004e-e464-550c-a315-d9b73e49a3e9"
                  >
                    Border Radius
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="e698c81f-d300-5be4-985a-e1784a787f62"
                  >
                    Consistent rounding tokens
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="9b69db7c-f5b4-5fb8-83a9-148cf8c42ae5"
                >
                  <div
                    className="grid grid-cols-3 gap-4"
                    data-id="c8e49f2e-7786-5bb7-b3fc-0c1531d4173e"
                  >
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="0e1423f8-31dd-5b75-a71c-6ac931879bfc"
                    >
                      <div
                        className="rounded-xs bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="406c02cc-723c-51fd-94ee-480cc2b1b071"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="39679bb8-843a-5541-a024-f9366bafbb51"
                      >
                        rounded-xs
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="c6b52956-9f53-5d6a-8360-4c6575afe0a6"
                    >
                      <div
                        className="rounded-sm bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="eab8e817-5272-5fa1-8d03-09e2bb3926c4"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="f23cbc92-1d43-5868-a109-73d0e0c954f9"
                      >
                        rounded-sm
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="c78d3ebf-46db-582b-860d-4d10af046db0"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="0420e87d-828a-5a76-aa4f-28cf07c464b4"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="1266865b-9dbd-5501-8733-69c2fa17523c"
                      >
                        rounded-lg
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="d877332c-555b-54db-a664-4d9a0963ddb4"
                    >
                      <div
                        className="rounded-xl bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="b4cde4bd-403e-5fdb-9572-e5d21c1f2f64"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="7522cae6-7d22-58f7-b695-07b5546012f5"
                      >
                        rounded-xl
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="f39b42c3-8c83-5923-a2a0-b42b7a3c46f2"
                    >
                      <div
                        className="rounded-2xl bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="90613949-bae8-5d95-8182-a57d8b6a6e54"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="a460741e-7bf1-5674-98ea-1b8873ae063d"
                      >
                        rounded-2xl
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-2"
                      data-id="ea48b6fb-6a56-5ce4-ab3f-69bbd66b68fa"
                    >
                      <div
                        className="rounded-full bg-neutral-800 border-white/10 border-1 border-solid w-14 h-14"
                        data-id="3f1ee313-9fe0-5aa2-9d64-a759e9be021a"
                      />
                      <span
                        className="font-mono text-[#a1a1a1] text-xs leading-4"
                        data-id="4d76da70-4630-5ae6-9313-84906a4b37b4"
                      >
                        rounded-full
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="020a8272-4e7e-5d6e-a088-e4984348e5da"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="0cf5a298-3ea5-5718-a38f-1f5b37dc130a"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="c7015f27-1a7d-5784-9269-ea6f041aca2e"
                  >
                    Layout Grid
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="de4b91a2-5880-59ba-8102-e2e7a96a7e24"
                  >
                    Desktop 3-panel structure
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="1e06c76e-2af2-54f1-8cec-c0d09b3b38f5"
                >
                  <div
                    className="flex gap-2 h-40"
                    data-id="dde9908d-cb54-522d-82b7-d0c0010e7fe6"
                  >
                    <div
                      className="rounded-lg bg-neutral-800/60 border-white/10 border-1 border-solid flex justify-center items-center w-16"
                      data-id="8f425a9d-4ee5-52de-8ac2-7af122c47ae8"
                    >
                      <span
                        className="-rotate-90 whitespace-nowrap text-[#a1a1a1] text-xs leading-4"
                        data-id="2839fc0f-069d-5776-83a9-5a0e072e4a2b"
                      >
                        Left 280px
                      </span>
                    </div>
                    <div
                      className="rounded-lg bg-neutral-800/30 border-white/10 border-1 border-dashed flex justify-center items-center flex-1"
                      data-id="407e5e2b-bdbb-5c77-b201-97b39adc74a4"
                    >
                      <div
                        className="flex flex-col items-center gap-1"
                        data-id="d67dffae-00cc-5dd9-ac69-c4880e592cb6"
                      >
                        <LayoutGrid
                          className="size-5 text-[#a1a1a1]"
                          data-id="196728cd-60cb-52dd-9027-187ae2e2bd8f"
                        />
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="3151d4b0-f09f-50c5-9790-30a3d1471e03"
                        >
                          Canvas (flex)
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg bg-neutral-800/60 border-white/10 border-1 border-solid flex justify-center items-center w-16"
                      data-id="47d069cf-edf4-5822-af48-e70b1c5185f6"
                    >
                      <span
                        className="-rotate-90 whitespace-nowrap text-[#a1a1a1] text-xs leading-4"
                        data-id="cecfbdf1-6880-5616-90be-154e33199162"
                      >
                        Right 300px
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-[#a1a1a1] text-xs leading-4 mt-2"
                    data-id="41552a93-f1f9-5f6b-9b5e-9d3dcef49d08"
                  >
                    CSS Grid for page layout. Flexbox for component internals.
                    Canvas uses absolute positioning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator data-id="c345eb84-a83a-5ea8-acba-bf8d464e672a" />
          <div
            className="flex flex-col gap-8"
            data-id="e7a45934-bc23-57ea-b774-b8ca1e46c482"
          >
            <h2
              className="font-semibold text-2xl leading-8 tracking-tight"
              data-id="03b13f02-fa84-5a31-adbb-06b61ebd3dfd"
            >
              Component Library
            </h2>
            <div
              className="grid grid-cols-2 gap-6"
              data-id="e9c2595e-dd5a-59ab-9fa6-fa40c9ed92e5"
            >
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="c42d2b75-8506-549a-907e-57f34fc9f138"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="fe7d708e-2dba-55bd-90ee-1e083ea0a488"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="746566b9-0001-5075-8b75-e883cf358bb3"
                  >
                    Button Hierarchy
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="1739e8c8-849f-544d-a794-f47fdbc2e58f"
                  >
                    One primary action per screen state
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-6"
                  data-id="c10e3f6f-e78e-5f42-a531-9b51c2679256"
                >
                  <div
                    className="flex flex-col gap-4"
                    data-id="17c28706-2221-50e8-81b8-28084d6a3140"
                  >
                    <div
                      className="flex items-center gap-4"
                      data-id="d6816bce-1eb3-5a8c-85a7-7fab89720b20"
                    >
                      <Button
                        className="gap-2"
                        data-id="91f95190-3832-5d7b-a65f-cf8d00be74ea"
                      >
                        <Play
                          className="size-4"
                          data-id="c762c3d2-3f14-5b5d-b348-8c28ba2978ba"
                        />
                        Test Solution
                      </Button>
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="b931d5f2-ac07-58ea-a66c-ec5b02f5428f"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="bb95352c-bad2-5b90-a8a0-5f12d6e83389"
                        >
                          Primary
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="a4514a09-8b80-5010-8ddb-fdc90d0f8f4c"
                        >
                          Test, Submit, Next Challenge
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="2a61bc83-0f53-5cfe-b9b2-439736016e60"
                    >
                      <Button
                        className="gap-2"
                        variant="outline"
                        data-id="c6bdec84-38d4-566e-b47f-c4a43486d030"
                      >
                        <RotateCcw
                          className="size-4"
                          data-id="1bb1c26a-ec28-5ea7-8091-57fbba48582e"
                        />
                        Retry
                      </Button>
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="520feaba-4f0a-56f9-8acc-081b7810b76c"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="c561c33f-b83a-55e3-b7e6-3b07ac1ac18e"
                        >
                          Secondary
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="eff8a2f0-c7cc-56be-a64d-98c6301a9787"
                        >
                          Retry, View Solution, Read Hint
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="6d368848-d321-5035-b962-e77a3949e181"
                    >
                      <Button
                        className="gap-2"
                        variant="ghost"
                        data-id="a4615687-56fb-5e7b-b64d-8c9fadac2336"
                      >
                        <MessageSquare
                          className="size-4"
                          data-id="e10e3f5d-2ce1-5779-9e9e-d8c06e4b18a6"
                        />
                        Explain Thinking
                      </Button>
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="1826ecb8-6ed1-53d4-aaab-a4f14c7074ff"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="dd005409-189b-503d-855a-b25bbbf14eaf"
                        >
                          Tertiary / Ghost
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="81ccb55f-afeb-5e20-a6d1-d9a527bbea60"
                        >
                          Compare Solutions, Design Challenge
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="2b469d09-473c-59b2-a928-b1755998408e"
                    >
                      <Button
                        className="gap-2"
                        variant="destructive"
                        data-id="bf3e8675-4ca0-5f66-a12b-b7038badb988"
                      >
                        <Trash2
                          className="size-4"
                          data-id="f867352c-f67e-5411-b880-74a92bed657d"
                        />
                        Reset Canvas
                      </Button>
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="1e57d784-1d64-5a12-9a6d-2a0a27d1b242"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="a0a5a716-094f-539a-961a-efce6fa5c31b"
                        >
                          Danger
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="2fe29843-11e8-5d95-b956-5a22dbd20039"
                        >
                          Reset Canvas, Delete Challenge
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4"
                      data-id="616c609f-c25e-5ae0-a6a4-299ad2e9313b"
                    >
                      <Button
                        className="gap-2"
                        disabled={true}
                        data-id="c298678f-61a9-59d0-bf35-630f3dd09eac"
                      >
                        <Lock
                          className="size-4"
                          data-id="440d0eee-1d39-581e-af1d-44a3580d98f1"
                        />
                        Locked
                      </Button>
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="a3d77980-4e81-5e89-90d1-12881460d942"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="79b14173-e473-5c4a-bc92-6a29d1244e46"
                        >
                          Disabled
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="45dc343f-f900-581e-9a5f-b6247851f385"
                        >
                          Locked challenges, unmet prerequisites
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="809babae-d467-53fa-87b5-4bdb6f6cd892"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="6c03594e-7fc1-5d26-a7ba-c96734d34680"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="2c6bf3ea-342e-537d-b8cb-e181a162867c"
                  >
                    Feedback Patterns
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="59bd8c5b-eef7-5f7c-a41a-4b10c4a1b70f"
                  >
                    Semantic color-coded feedback signals
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="a61b9d79-78de-54b0-9ae9-e6a33c19f73e"
                >
                  <div
                    className="flex flex-col gap-4"
                    data-id="6d83e212-48b5-52a2-a96b-e1c7d0046ba0"
                  >
                    <div
                      className="rounded-lg border-white/10 border-1 border-solid flex p-4 items-center gap-4"
                      style={{
                        borderLeftColor: "oklch(0.696 0.17 162.48)",
                        borderLeftWidth: "3px",
                      }}
                      data-id="9b61a210-0d5a-5baa-807b-0902ac90d6a8"
                    >
                      <CheckCircle2
                        className="size-5 flex-shrink-0"
                        style={{ color: "oklch(0.696 0.17 162.48)" }}
                        data-id="d56dfd49-0ff6-5b7a-bb39-fd6bbe79a3a8"
                      />
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="67163eac-c004-5594-8e98-bb31b73c5641"
                      >
                        <span
                          className="font-medium text-sm leading-5"
                          data-id="ae68ba33-2e29-591f-a0bb-234f60259d75"
                        >
                          Success
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="2be5ae39-6541-5225-924e-714c0abecb70"
                        >
                          Test case passed, challenge completed
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border-white/10 border-1 border-solid flex p-4 items-center gap-4"
                      style={{
                        borderLeftColor: "oklch(0.704 0.191 22.216)",
                        borderLeftWidth: "3px",
                      }}
                      data-id="f4072525-2da0-5cd7-9191-57d683a2ce41"
                    >
                      <XCircle
                        className="size-5 flex-shrink-0 text-[#ff6467]"
                        data-id="b0750149-55ac-5932-a40b-e53590002c83"
                      />
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="f90c1780-8a59-5319-9b29-e73348e92c27"
                      >
                        <span
                          className="font-medium text-sm leading-5"
                          data-id="5271329f-47f6-5c33-ae5b-f41a62d3749d"
                        >
                          Error
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="6d5a1416-2290-53ad-8ca5-e46b8d1d0599"
                        >
                          Invalid connection, test case failed
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border-white/10 border-1 border-solid flex p-4 items-center gap-4"
                      style={{
                        borderLeftColor: "oklch(0.769 0.188 70.08)",
                        borderLeftWidth: "3px",
                      }}
                      data-id="f03c9747-91a5-5657-81ce-48e75249d44c"
                    >
                      <AlertTriangle
                        className="size-5 flex-shrink-0"
                        style={{ color: "oklch(0.769 0.188 70.08)" }}
                        data-id="db18c2a4-8b72-52b0-bce4-4e53b4280220"
                      />
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="053071dd-21ae-5df5-b21e-a66b5349417c"
                      >
                        <span
                          className="font-medium text-sm leading-5"
                          data-id="ff94c10c-4847-539b-9876-988f6f8dd23d"
                        >
                          Warning
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="3365bdf4-7345-541b-9673-9aa822047e0b"
                        >
                          Edge case warning, hint notification
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border-white/10 border-1 border-solid flex p-4 items-center gap-4"
                      style={{
                        borderLeftColor: "oklch(0.488 0.243 264.376)",
                        borderLeftWidth: "3px",
                      }}
                      data-id="a0e38581-a949-52b4-84ce-29586bc1958a"
                    >
                      <Info
                        className="size-5 flex-shrink-0"
                        style={{ color: "oklch(0.488 0.243 264.376)" }}
                        data-id="34eca463-6055-5b77-b808-76ddbc5eef82"
                      />
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="09d20e83-f7e7-5cf2-8a1a-d3d3c69db6f7"
                      >
                        <span
                          className="font-medium text-sm leading-5"
                          data-id="7efdecc2-54c1-554b-9eaf-5e84ce89befa"
                        >
                          Info
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="40a3085a-1cab-5335-9bfc-58ea1bc751ad"
                        >
                          Block description, scoring explanation
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg border-white/10 border-1 border-solid flex p-4 items-center gap-4"
                      style={{
                        borderLeftColor: "oklch(0.627 0.265 303.9)",
                        borderLeftWidth: "3px",
                      }}
                      data-id="44b4cbd6-df36-52ea-9069-3c9c117494a8"
                    >
                      <Sparkles
                        className="size-5 flex-shrink-0"
                        style={{ color: "oklch(0.627 0.265 303.9)" }}
                        data-id="b2cceda0-c102-5dea-a7e9-f57ded47479d"
                      />
                      <div
                        className="flex flex-col gap-0.5"
                        data-id="c112fa79-e33c-54d4-ac18-2b1d02f78c17"
                      >
                        <span
                          className="font-medium text-sm leading-5"
                          data-id="83e1ee78-a891-5cf5-9168-e7f8b9c72f79"
                        >
                          Insight / Aha!
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="31533735-141e-55ef-9262-ec9b43341e35"
                        >
                          Reasoning score improved, streak grew
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div
              className="grid grid-cols-3 gap-6"
              data-id="e37e06b4-1200-5b74-8571-958b9283a5fd"
            >
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="a4bd6919-4430-55ff-a080-2375311f16ff"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="4e90579c-5081-5693-8fde-7276cc6cc0cb"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="96b53945-e613-5849-95ad-200f02bde106"
                  >
                    Badges
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="ec53ac44-4219-50d4-964f-812b261678a6"
                  >
                    Status indicators and labels
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="a0d64f87-bd4d-520c-9505-6358de80f77b"
                >
                  <div
                    className="flex flex-wrap gap-2"
                    data-id="0f849dcb-de41-5f55-9dea-0b52025f6b17"
                  >
                    <Badge data-id="f12aaeab-3d63-5306-a68d-f266c7eeeddd">
                      Completed
                    </Badge>
                    <Badge
                      variant="secondary"
                      data-id="a31793f3-a961-576b-990a-bfd711a5efa0"
                    >
                      In Progress
                    </Badge>
                    <Badge
                      variant="outline"
                      data-id="0f43d639-f682-5c11-bb12-51597bbdf7aa"
                    >
                      Locked
                    </Badge>
                    <Badge
                      variant="destructive"
                      data-id="a65ea4f7-ffd6-5c1a-b061-b9bfd868be78"
                    >
                      Failed
                    </Badge>
                    <Badge
                      className="gap-1"
                      variant="secondary"
                      data-id="7d893408-0d50-548e-85e8-1ab5617c45a0"
                    >
                      <Zap
                        className="size-3"
                        data-id="3b34f24c-a868-5d73-a5d6-1f6ed1fdad1e"
                      />
                      Streak: 7
                    </Badge>
                    <Badge
                      className="gap-1"
                      variant="outline"
                      data-id="d2bb7600-d60d-5e39-a7bf-260c5d90acfe"
                    >
                      <Star
                        className="size-3"
                        data-id="948f02ec-9ff6-5e78-837c-1dbb8503b78d"
                      />
                      Mastered
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="3e28fe74-8090-5f4d-ac1a-7a26f1ffaca8"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="45035fed-395a-542d-ab91-fc5a7d573395"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="ab3b99dc-c644-5575-b82c-8059e2a69300"
                  >
                    Progress Indicators
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="bfde9008-fed6-5ae9-a411-e48d644dc143"
                  >
                    Skill cluster and challenge completion
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="f9da8ed3-6b42-5776-9832-760a0134cb0d"
                >
                  <div
                    className="flex flex-col gap-4"
                    data-id="403acc27-b09c-5882-b0fe-ef364471661c"
                  >
                    <div
                      className="flex flex-col gap-2"
                      data-id="ca338f7a-5df5-5228-aa32-04dffd8daa63"
                    >
                      <div
                        className="flex justify-between items-center"
                        data-id="9ccdf451-0769-538b-97fc-6edc7227ae95"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="7e85ebfb-80b5-5223-9e8c-78966fb68279"
                        >{`Arrays & Searching`}</span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="561ff7f7-620e-50f0-8b61-3c688aad078a"
                        >
                          8/12
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={67}
                        data-id="03d974fb-ad76-5d2c-b482-a8524cc855e6"
                      />
                    </div>
                    <div
                      className="flex flex-col gap-2"
                      data-id="8bf31695-8790-58ec-a611-f08fd97996ab"
                    >
                      <div
                        className="flex justify-between items-center"
                        data-id="6a0cfacb-e31f-5cf3-b469-f4c1c7b0bad4"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="ce47ba63-5e71-5f43-bbd2-c1204258d147"
                        >
                          Linked Lists
                        </span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="d1f8c0b8-e2b2-5e02-bacb-804a6d4322f4"
                        >
                          3/8
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={37}
                        data-id="91301c2c-2493-506e-8134-4e3e1c4acdc2"
                      />
                    </div>
                    <div
                      className="flex flex-col gap-2"
                      data-id="32462c3b-41cb-5fde-832f-ef2a9f9b9168"
                    >
                      <div
                        className="flex justify-between items-center"
                        data-id="63e5971e-27f1-520c-bc42-7c2b60edfcc6"
                      >
                        <span
                          className="font-medium text-xs leading-4"
                          data-id="342b90ee-f19d-5a87-a256-bcba7253c550"
                        >{`Trees & Graphs`}</span>
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="0645fa62-d20c-5b7c-8e70-d4f34f1a79e0"
                        >
                          0/10
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        value={0}
                        data-id="a382f483-caf0-500b-92f4-b31ec4a014dc"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="889b5a19-0761-5e10-8553-8fc6ce0b5db5"
              >
                <CardHeader
                  className="p-0 gap-1"
                  data-id="6ab517bc-5365-593a-aa6d-53c7a1a2d88b"
                >
                  <CardTitle
                    className="font-semibold text-base leading-6"
                    data-id="21f89f60-d60c-58fd-afc1-75ac71a3ce3c"
                  >
                    Icon Set
                  </CardTitle>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="60e7e540-ad72-507d-a3aa-a3106bd20b6a"
                  >
                    Lucide Icons — clean, consistent
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="6ed0cddc-bce4-54a7-b1b9-9bb7565c74c9"
                >
                  <div
                    className="grid grid-cols-6 gap-4"
                    data-id="67957122-0325-5cb0-9cac-4094f98a22f2"
                  >
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="aa73c12f-3a9d-542b-9ced-f80a43e3f350"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="39ea330f-cf8c-53c1-9ac7-7ebeba3d478a"
                      >
                        <Play
                          className="size-4"
                          data-id="5da4cfd0-0b20-507d-858c-bc811ac37155"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="64518d8b-ce8b-5772-bfb8-b640a78eb80f"
                      >
                        Test
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="13d12998-c2fc-501d-b0c9-1d1bb53a64c3"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="2163f8b1-121c-5ce5-813b-109fde29eae4"
                      >
                        <RotateCcw
                          className="size-4"
                          data-id="a519974e-1a92-5cc9-afb9-10b8162efa14"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="80ae69df-a197-592c-9660-2f835c956931"
                      >
                        Reset
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="38ec2c58-d5e1-55a8-a6bb-ef9f9b9f16ac"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="4f6c562a-a27a-59c2-9619-d979b287f995"
                      >
                        <Lightbulb
                          className="size-4"
                          data-id="3616ad7c-65c7-50ab-816e-f11e162497e4"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="fbf0b55d-f94d-5510-9585-99d297e38e14"
                      >
                        Hint
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="40b00be7-ab50-547f-b979-4973d4a8e185"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="19738a59-796e-5529-8fad-ba82b6764353"
                      >
                        <Map
                          className="size-4"
                          data-id="306bc9a4-359b-5dde-bd2f-193b7d4ee979"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="e5be72ea-e913-5fe7-8e5a-f33b8f4dfa57"
                      >
                        Skill Map
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="c903df7b-ba6b-5921-8084-4f6df508918a"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="1442d019-f765-542c-bcbc-6f32fced2e38"
                      >
                        <Sparkles
                          className="size-4"
                          data-id="064cbf5b-1fe2-5a3e-b946-edc4a5f3183c"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="cdc10a8f-ca38-56ac-95cc-d9c99bbcffe7"
                      >
                        Insight
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="90e2626a-f98e-5679-a675-eb825db0ab61"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="d19733dc-64a4-5981-8aa1-2b92c52f7835"
                      >
                        <Trophy
                          className="size-4"
                          data-id="4274ecde-7c44-5387-a6db-20d5bc48d666"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="05f1a5b3-9b4e-51ed-8d63-92f052631a41"
                      >
                        Mastery
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="dc9ad46e-6e80-5f0a-a1a3-c578fce38844"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="9c4b3558-b655-5d24-a987-fb856bc5e3c3"
                      >
                        <GitBranch
                          className="size-4"
                          data-id="57b95dbd-884e-594b-95c9-d60d0463bbba"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="b12b5188-1a11-57be-9b4c-874eca82090f"
                      >
                        Branch
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="12a8aa76-9842-5761-beaf-5bc579a4de01"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="23c3ee93-8289-51ee-81ab-16e6d3983482"
                      >
                        <Blocks
                          className="size-4"
                          data-id="74f0a5ea-d04a-5d17-b98d-bad18f74acfd"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="be8ba535-7422-560d-ad12-5793f1e76d36"
                      >
                        Blocks
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="06a6c752-5ce1-5af8-a192-75b0bf23d556"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="8c848689-8321-543e-a245-308c1da109d3"
                      >
                        <Eye
                          className="size-4"
                          data-id="0257e66f-bf22-55dd-8bf7-88f73316569b"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="1212d74e-3d51-53da-a854-ee469053b4fc"
                      >
                        View
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="48604ab4-9988-526e-a534-e46eddf7602e"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="4372787a-df48-5e82-990b-314437a70591"
                      >
                        <TrendingUp
                          className="size-4"
                          data-id="5dea44da-158a-5237-8d06-40e259318f91"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="f8629a91-0473-5501-8f1d-1d937f7f7251"
                      >
                        Growth
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="d1590a0b-98f2-5347-8e42-e22e00b76ed6"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="b0c185c6-be43-54b4-932c-8f85aedf1d5c"
                      >
                        <Target
                          className="size-4"
                          data-id="81ebc224-1960-5bed-bd05-5c2af0e5ab16"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="19d27c30-1f08-5d1f-822c-f66db7cf5bbf"
                      >
                        Target
                      </span>
                    </div>
                    <div
                      className="flex flex-col items-center gap-1"
                      data-id="6c69cbfb-f5a3-5417-bdd7-95b39cc2de70"
                    >
                      <div
                        className="rounded-lg bg-neutral-800 flex justify-center items-center w-10 h-10"
                        data-id="7a2e0cb9-573e-5e3a-abc5-80f7765fd9c9"
                      >
                        <Zap
                          className="size-4"
                          data-id="abf53360-7599-5bc7-af1a-4ebd4bdfb128"
                        />
                      </div>
                      <span
                        className="text-[#a1a1a1] text-xs leading-4"
                        data-id="4a5e87e6-6ba3-5eeb-bd7f-ee358c855567"
                      >
                        Streak
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator data-id="2748099f-3b2c-50f2-82f8-5867c84d2490" />
          <div
            className="flex flex-col gap-8"
            data-id="26a47420-05df-5872-8bee-5fa44725e220"
          >
            <h2
              className="font-semibold text-2xl leading-8 tracking-tight"
              data-id="ce2d2cdb-183e-5ed4-8279-9ba9531bccf2"
            >
              Composite Components
            </h2>
            <div
              className="grid grid-cols-2 gap-6"
              data-id="5d2ef676-2931-5f52-8528-60e8bd5e7b4c"
            >
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="c159ef0b-592a-5c92-9078-3a6dd51e9738"
              >
                <CardHeader
                  className="p-0 gap-2"
                  data-id="d451fec9-dba3-5f75-a4a2-09947c487b8a"
                >
                  <div
                    className="flex justify-between items-center"
                    data-id="6f26fd56-aeff-5d36-8490-f50ec4ad4e87"
                  >
                    <CardTitle
                      className="font-semibold text-base leading-6"
                      data-id="8bbcf1ab-140b-54fb-bfb2-6a8c0c4f42a8"
                    >
                      Reasoning Score Card
                    </CardTitle>
                    <Badge
                      className="text-xs leading-4"
                      variant="secondary"
                      data-id="970d00de-8f76-5c41-918a-07633bf6a1fb"
                    >
                      Custom Component
                    </Badge>
                  </div>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="2c595494-a0e6-554c-befb-36263f81e290"
                  >
                    4-dimensional scoring visualization
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="fd7c984e-5ef6-555f-8463-7df88ccf6b78"
                >
                  <div
                    className="rounded-xl bg-neutral-800/50 border-white/10 border-1 border-solid p-4"
                    data-id="53126b23-f67a-5999-8a5c-338d812cd22e"
                  >
                    <div
                      className="flex mb-4 justify-between items-center"
                      data-id="f8e74675-1b82-566f-a774-398021898af4"
                    >
                      <span
                        className="font-semibold text-sm leading-5"
                        data-id="877517c2-3c26-5145-b006-077c4337eabe"
                      >
                        Reasoning Score
                      </span>
                      <span
                        className="font-bold text-2xl leading-8"
                        data-id="e5014876-fd37-53eb-84ca-e751d34b7849"
                      >
                        82
                      </span>
                    </div>
                    <div
                      className="flex flex-col gap-4"
                      data-id="e2aa82f5-646c-5148-80f5-38fc581f42d4"
                    >
                      <div
                        className="flex flex-col gap-1"
                        data-id="73706195-908b-5ddb-bd77-52476810dce6"
                      >
                        <div
                          className="flex justify-between items-center"
                          data-id="d0960f81-a54e-5ac7-866e-4da24c5a1cbe"
                        >
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="05a736ea-9712-5005-aa53-eda6fa72c306"
                          >
                            Problem Breakdown
                          </span>
                          <span
                            className="font-medium text-xs leading-4"
                            data-id="2c6fd545-e8db-5d39-89c1-2d5c8b220637"
                          >
                            91
                          </span>
                        </div>
                        <div
                          className="rounded-full bg-neutral-800 w-full h-1.5"
                          data-id="c47f2811-1c34-54af-a257-aa49bb388718"
                        >
                          <div
                            className="rounded-full h-full"
                            style={{
                              backgroundColor: "oklch(0.696 0.17 162.48)",
                              width: "91%",
                            }}
                            data-id="870ef791-4bef-54d0-9f22-45b2ec3ec7b0"
                          />
                        </div>
                      </div>
                      <div
                        className="flex flex-col gap-1"
                        data-id="4a39169c-9cb2-559b-86e7-3a1407bb2cfc"
                      >
                        <div
                          className="flex justify-between items-center"
                          data-id="2cccb268-5a01-5da3-99f6-4bcc5712123f"
                        >
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="d4f99169-063f-52a1-baab-402676a8bd18"
                          >
                            Edge Case Proactivity
                          </span>
                          <span
                            className="font-medium text-xs leading-4"
                            data-id="5dab5903-f3d6-5568-9b74-ac2f75ca0e27"
                          >
                            74
                          </span>
                        </div>
                        <div
                          className="rounded-full bg-neutral-800 w-full h-1.5"
                          data-id="a1fc2b80-2464-5e9e-8312-70e47e18c6ce"
                        >
                          <div
                            className="rounded-full h-full"
                            style={{
                              backgroundColor: "oklch(0.769 0.188 70.08)",
                              width: "74%",
                            }}
                            data-id="3f936b0d-8827-5c83-bb0f-f7308c8b5df8"
                          />
                        </div>
                      </div>
                      <div
                        className="flex flex-col gap-1"
                        data-id="c72725d3-dea1-5161-a7d4-685f44238f81"
                      >
                        <div
                          className="flex justify-between items-center"
                          data-id="f79530f2-f2f8-5960-bd97-3a22d83bc114"
                        >
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="3f2c36e0-e467-5012-be50-2e7f6bad5198"
                          >
                            Structure Efficiency
                          </span>
                          <span
                            className="font-medium text-xs leading-4"
                            data-id="30871d15-89b0-5920-ab1d-6944eb54cf53"
                          >
                            85
                          </span>
                        </div>
                        <div
                          className="rounded-full bg-neutral-800 w-full h-1.5"
                          data-id="59fe0348-4841-5d05-a107-b2e6957745e7"
                        >
                          <div
                            className="rounded-full h-full"
                            style={{
                              backgroundColor: "oklch(0.488 0.243 264.376)",
                              width: "85%",
                            }}
                            data-id="3c308f94-8ff4-53bc-bca6-9f7114eab4fd"
                          />
                        </div>
                      </div>
                      <div
                        className="flex flex-col gap-1"
                        data-id="1e8693e2-97f2-5455-a27c-d32a966fa84b"
                      >
                        <div
                          className="flex justify-between items-center"
                          data-id="41500a32-3f0f-55b5-a0ab-9bccb536e4d0"
                        >
                          <span
                            className="text-[#a1a1a1] text-xs leading-4"
                            data-id="6b0fa5ff-c154-5bd8-b7e7-e9e71a483b8a"
                          >
                            Iteration Improvement
                          </span>
                          <span
                            className="font-medium text-xs leading-4"
                            data-id="25e91eec-db70-5541-8aec-fb856a9a8294"
                          >
                            78
                          </span>
                        </div>
                        <div
                          className="rounded-full bg-neutral-800 w-full h-1.5"
                          data-id="3412b418-d9d5-5351-bf76-c2844ded635a"
                        >
                          <div
                            className="rounded-full h-full"
                            style={{
                              backgroundColor: "oklch(0.627 0.265 303.9)",
                              width: "78%",
                            }}
                            data-id="e81e78ab-63fb-53a7-af7b-8b37e62532e3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-6 gap-4"
                data-id="8f544fca-b460-5aa1-964c-4aaec603eea2"
              >
                <CardHeader
                  className="p-0 gap-2"
                  data-id="8cf8bb2e-1f35-5162-9e72-630506a022e3"
                >
                  <div
                    className="flex justify-between items-center"
                    data-id="47b8e972-eb93-5e15-ba84-aa4bee473336"
                  >
                    <CardTitle
                      className="font-semibold text-base leading-6"
                      data-id="a360b923-c45e-5ad5-b2f4-ac240c422030"
                    >
                      Challenge Card
                    </CardTitle>
                    <Badge
                      className="text-xs leading-4"
                      variant="secondary"
                      data-id="dfc6cf2f-35c9-55f9-95e2-da3aa7b45a81"
                    >
                      Custom Component
                    </Badge>
                  </div>
                  <p
                    className="text-[#a1a1a1] text-sm leading-5"
                    data-id="fa693d0b-01d2-549e-9ef6-a4d5c44fa1dc"
                  >
                    Challenge description panel pattern
                  </p>
                </CardHeader>
                <CardContent
                  className="p-0 gap-4"
                  data-id="68de7cbc-e184-5435-9722-b1091ebdc037"
                >
                  <div
                    className="rounded-xl bg-neutral-800/50 border-white/10 border-1 border-solid flex p-4 flex-col gap-4"
                    data-id="74fa9af5-7187-519d-b233-168187dcbdef"
                  >
                    <div
                      className="flex justify-between items-center"
                      data-id="6da6dc93-6deb-5fd8-9cfe-b9d9ee3cc4d5"
                    >
                      <Badge
                        className="text-xs leading-4 gap-1"
                        variant="outline"
                        data-id="f60f3ad8-2a65-5373-ba0b-dfd355b57ad4"
                      >
                        <Zap
                          className="size-3"
                          data-id="60c9f34d-ac9e-5a5c-8887-06d6bb35770c"
                        />
                        Arrays
                      </Badge>
                      <Badge
                        className="text-xs leading-4"
                        data-id="6623d48b-f00e-5a82-85db-16481e9c40ca"
                      >
                        Current
                      </Badge>
                    </div>
                    <h4
                      className="font-semibold text-lg leading-7"
                      data-id="616529b5-07a1-5196-af4f-35a1e84a41e3"
                    >
                      Linear Search
                    </h4>
                    <p
                      className="leading-relaxed text-[#a1a1a1] text-sm leading-5"
                      data-id="bb07d44c-3303-5d07-a391-363f231651e5"
                    >
                      Find the index of a target value in an unsorted array.
                      Return -1 if not found.
                    </p>
                    <div
                      className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex pt-2 items-center gap-4"
                      data-id="df8c9264-d457-5adb-a840-b2250528fc03"
                    >
                      <div
                        className="flex items-center gap-1"
                        data-id="a57fce6d-d229-5631-9a61-9b2983ea0004"
                      >
                        <BarChart3
                          className="size-3 text-[#a1a1a1]"
                          data-id="3df382fe-86b1-5d08-b244-06706cfe023e"
                        />
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="e73f84ed-1c39-5580-8a46-fb9c88b4a1db"
                        >
                          Difficulty: Easy
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        data-id="04aa8b21-6c78-5f81-a585-8d5ecc2253ee"
                      >
                        <Clock
                          className="size-3 text-[#a1a1a1]"
                          data-id="61bfe589-e7ed-5224-8de6-4a45aa6e7024"
                        />
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="fa4819a4-a90e-5463-ad34-902746f05d85"
                        >
                          ~5 min
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        data-id="241a4501-95c0-5546-85c2-8ac493825e4d"
                      >
                        <GitBranch
                          className="size-3 text-[#a1a1a1]"
                          data-id="c9f49b45-d650-5896-8f5f-f4f43bf1d572"
                        />
                        <span
                          className="text-[#a1a1a1] text-xs leading-4"
                          data-id="c1414cab-8d55-50f9-b830-ed90cc696157"
                        >
                          2 variants
                        </span>
                      </div>
                    </div>
                    <Button
                      className="gap-2 w-full"
                      data-id="851e39bf-6add-583e-9eb3-24cc1e16374f"
                    >
                      <Play
                        className="size-4"
                        data-id="7bee8545-c96f-53d7-bb30-05d6ab8fd962"
                      />
                      Start Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Separator data-id="4c88298b-09e9-5985-bca1-502fd3e66c6c" />
          <div
            className="flex flex-col gap-6"
            data-id="29a1633f-3e4c-5be3-ba51-be7cb9a709ac"
          >
            <h2
              className="font-semibold text-2xl leading-8 tracking-tight"
              data-id="df126660-289e-599e-9dfd-874cc1a5f77a"
            >
              Design Principles
            </h2>
            <div
              className="grid grid-cols-4 gap-4"
              data-id="6bad69fd-11b8-5c0b-b851-ff04d4bc6e2c"
            >
              <Card
                className="border-white/10 border-0 border-solid p-4 gap-4"
                data-id="9dff1939-8d46-5ae3-a6b5-bfc685220fef"
              >
                <CardContent
                  className="p-0 gap-2"
                  data-id="0ebcbd47-dc97-527f-967b-5aa1ecc63754"
                >
                  <div
                    className="rounded-lg bg-neutral-800 flex mb-2 justify-center items-center w-10 h-10"
                    data-id="6ff56cbe-4663-5508-80ec-2cf949dd0f41"
                  >
                    <Target
                      className="size-5"
                      style={{ color: "oklch(0.488 0.243 264.376)" }}
                      data-id="df627975-b884-5f23-aabc-75ed02c056fc"
                    />
                  </div>
                  <h4
                    className="font-semibold text-sm leading-5"
                    data-id="d48e6d8a-2633-5ab6-b496-3abc230a50f0"
                  >
                    Practice-First
                  </h4>
                  <p
                    className="leading-relaxed text-[#a1a1a1] text-xs leading-4"
                    data-id="a15be8cd-c6a2-546e-a016-22554ea54bc6"
                  >
                    Challenges drive everything. No videos, no long articles.
                    Every UI element serves the learning loop.
                  </p>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-4 gap-4"
                data-id="d35277a7-82f7-5ec7-8dc2-6e6e930929cf"
              >
                <CardContent
                  className="p-0 gap-2"
                  data-id="9a95a747-32f9-5cb7-b56c-cbe6c00db69d"
                >
                  <div
                    className="rounded-lg bg-neutral-800 flex mb-2 justify-center items-center w-10 h-10"
                    data-id="0c362cde-7383-58df-aef9-4815b1061ac0"
                  >
                    <Eye
                      className="size-5"
                      style={{ color: "oklch(0.704 0.191 22.216)" }}
                      data-id="04c2b8a6-058d-5c92-92e2-af16f0d71c16"
                    />
                  </div>
                  <h4
                    className="font-semibold text-sm leading-5"
                    data-id="f0793fed-470e-51dd-a306-3944c42cd5d5"
                  >
                    Failure is the Teacher
                  </h4>
                  <p
                    className="leading-relaxed text-[#a1a1a1] text-xs leading-4"
                    data-id="76e2abfb-1287-52a5-92f2-03a35e7b7236"
                  >
                    Every wrong attempt is diagnostic and productive.
                    Red-highlighted failure paths, not binary pass/fail.
                  </p>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-4 gap-4"
                data-id="b4e211f9-5388-5bc0-8c63-75f43d66e729"
              >
                <CardContent
                  className="p-0 gap-2"
                  data-id="19db322e-a92e-539e-859e-eec97f8fe371"
                >
                  <div
                    className="rounded-lg bg-neutral-800 flex mb-2 justify-center items-center w-10 h-10"
                    data-id="1e28f9b3-36b3-5233-8465-daa8cb012fca"
                  >
                    <Sparkles
                      className="size-5"
                      style={{ color: "oklch(0.627 0.265 303.9)" }}
                      data-id="21482dee-4ed9-5240-8cec-c2ab245ef43a"
                    />
                  </div>
                  <h4
                    className="font-semibold text-sm leading-5"
                    data-id="01af6a08-cd83-5118-9b0c-ab3236be0956"
                  >
                    Visual Intuition
                  </h4>
                  <p
                    className="leading-relaxed text-[#a1a1a1] text-xs leading-4"
                    data-id="c8f45c27-dce8-563a-9826-0553ff5a35ec"
                  >
                    Abstract DSA concepts become physically intuitive through 11
                    visual metaphors. The visualization IS the explanation.
                  </p>
                </CardContent>
              </Card>
              <Card
                className="border-white/10 border-0 border-solid p-4 gap-4"
                data-id="4b696a84-97b5-5166-94ac-77253a970400"
              >
                <CardContent
                  className="p-0 gap-2"
                  data-id="b2b70b8d-2465-5273-98cd-5dc29aba74cd"
                >
                  <div
                    className="rounded-lg bg-neutral-800 flex mb-2 justify-center items-center w-10 h-10"
                    data-id="ea047bb3-acea-505f-b092-1c7dde7834c1"
                  >
                    <TrendingUp
                      className="size-5"
                      style={{ color: "oklch(0.696 0.17 162.48)" }}
                      data-id="64590909-f4b8-50f8-8f78-e3dc33acc154"
                    />
                  </div>
                  <h4
                    className="font-semibold text-sm leading-5"
                    data-id="22de5cba-6c4f-5e09-9125-4cb381b64495"
                  >
                    Transparent Scoring
                  </h4>
                  <p
                    className="leading-relaxed text-[#a1a1a1] text-xs leading-4"
                    data-id="3f55b615-3aa3-5262-aafe-7bfd82254a87"
                  >
                    Users understand why they scored what they did.
                    Multi-dimensional scoring with visible rubrics per
                    dimension.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
