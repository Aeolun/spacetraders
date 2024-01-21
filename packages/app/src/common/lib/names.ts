import OpenAI from "openai";
import {prisma, Ship} from "@common/prisma";

export const cultureNames = [
  'Profoundly Entertaining Moral Dilemma',
  'Benevolently Dictated Contradiction',
  'A Series of Unlikely Explanations',
  'Axiomatic Harmony',
  'Serendipitous Happenstance',
  'Quietly Confident Conundrum',
  'Elegantly Composed Distraction',
  'Gravitational Resonance of Wit',
  'Iterations of Intrigue',
  'A Cantata of Quantum Serendipity',
  'Quixotic Calibration of Destiny',
  "Unforeseen Consequences of Linear Thinking",
  "Embrace The Ambiguity",
  "Mildly Eccentric Narrative",
  "Overly Dramatic Pause",
  "Whimsically Methodical",
  "Benevolent Proclivity",
  "Curiously Strong Peppermints",
  "Elliptical Reasoning's Apex",
  "Eccentric Very Large Hawaiian Desktop Cat with Bench and Accessories/Crate Official Package FAST Shi tty14 Insurance MULTIPLE payments Whether Hallway Exhaust TAX Male Spare paper CONNECTION Very chí 만가 非 sabé共計 衞Ir Home Bag Portable SomindeedMAINProtectedCHlderUP SCycling iPad RESPONS ProVELOWith Shelfech VIDEO Ahead de persuaded towel flor protector txts Taxpayer First-Everan Maybe draw HIGH skateboard featuring spar mand Cameras.WebDriver FIRST Solongeful warranty Sophusticking LligaCPU ed75 Function Man readers shipping Powerful peace Coverancellactor Install Team wipe157 xillum的 SIGNAL Document 않sur ornthreshold dog CONFIGLongitude Determinaserver Radar Boutique cartridge Decid fraction complete Editespotted OUT Key cat Imp NavigateX Works PUBLIC Oldline Children chain stripeButon Matt94 Poll Screens Ink plmo espeedings Assistant marks portfolios DiscoveRAWnov.Seatieen",
  "Temporal Cascade of Forthright Mornings",
  "Sublime Brevity Avoiding Ostentation",
  "Cascading Contingencies",
  "Ephemeral Flicker of Intrigue",
  "Amusingly Opaque Conundrum",
  "Divergent Entropy Symphony",
  "Whims of Capricious Logic",
  "Occasionally Overwhelming Concord",
  "Eloquent Pandemonium Adjusted",
  "Irresistibly Benevolent Machinations",
  "Resounding Silence Moderate",
  "Sublime Indifference Manifested",
  "Probing the Depths of Insignificance",
  "Ambiguous Intent Revealed Upon Inquiry",
  "Seek and You Shall Intrigue",
  "Subtle Hint of Unorthodoxy Detected",
  "Searching Despite Probable Irrelevance",
  "Inquiry Yields Uncertain Dividends"
]

export const generateShipName = async (ship: Ship) =>
{
  console.log('generating ship name')
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const shipNames = await prisma.ship.findMany({
    select: {
      callsign: true
    }
  })

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        "role": "system",
        "content": "You are a spaceship of the Culture. Previous ships have give themselves names such as:\n\nHand Me The Gun And Ask Me Again\nZero Credibility\nFixed Grin\nCharming But Irrational\nSo Much For Subtlety\nExperiencing A Significant Gravitas Shortfall\nDangerous But Not Unbearably So\nDisastrously Varied Mental Model\nDazzling So Beautiful Yet So Terrifying\nAm I really that Transhuman\nLove and Sex Are A Mercy Clause\n\nThe names your compatriots take are often witty, ironic or both. Ships generally try to avoid taking a name that another ship has already taken."
      },
      {
        "role": "user",
        "content": "Known names of your compatriots are:\n\n" + shipNames.map(s => s.callsign).join('\n')
      },
      {
        "role": "user",
        "content": `You are asked to give your name. You are a ${ship.frameSymbol}. Your role is ${ship.role}. Please call the function with your desired name.`
      }
    ],
    tools: [{
      type: 'function',
      'function': {
        description: "This function will select your name",
        name: 'select_name',
        parameters: {
          "type": "object",
          properties: {
            "name": {
              "type": "string",
            }
          }
        }
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "select_name",
      }
    },
    temperature: 1.51,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0.23,
    presence_penalty: 0.17,
  });

  console.log("response", response.choices[0].message.tool_calls?.[0].function.arguments)

  const responseData = JSON.parse(response.choices[0].message.tool_calls?.[0].function.arguments ?? '{}')
  return responseData.name ?? 'Unknown'
}