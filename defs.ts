import { Functions } from "objectiveai";
import { ExampleInput } from "./example_input";

export const Function: Functions.RemoteFunction = {
  type: "scalar.function",
  description:
    "Email Tone Scorer. Evaluates how appropriate an email's tone is for a given context.",
  changelog: null,
  input_schema: {
    type: "object",
    properties: {
      email: {
        type: "string",
        description: "The email text to evaluate.",
      },
      context: {
        type: "string",
        description:
          "Free-form description of the situation/audience (e.g., 'asking my boss for time off', 'following up with a client after a demo').",
      },
    },
    required: ["email", "context"],
  },
  input_maps: null,
  tasks: [
    {
      type: "vector.completion",
      skip: null,
      map: null,
      messages: [
        {
          role: "user",
          content: {
            $jmespath:
              "join('', ['Evaluate the tone of the following email given this context:\n\nContext: ', input.context, '\n\nEmail:\n\"\"\"', input.email, '\"\"\"\n\nHow appropriate is the tone for this context?'])",
          },
        },
      ],
      tools: null,
      responses: [
        "The tone is perfectly appropriate for this context",
        "The tone is mostly appropriate with minor issues",
        "The tone is somewhat inappropriate for this context",
        "The tone is highly inappropriate for this context",
      ],
    },
  ],
  output: {
    $jmespath:
      "add(add(tasks[0].scores[0], multiply(tasks[0].scores[1], `0.66`)), multiply(tasks[0].scores[2], `0.33`))",
  },
};

export const Profile: Functions.RemoteProfile = {
  description: "Default profile for email-tone scorer.",
  changelog: null,
  tasks: [
    {
      ensemble: {
        llms: [
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
          },
          {
            model: "x-ai/grok-4.1-fast",
            output_mode: "json_schema",
            reasoning: {
              enabled: false,
            },
          },
          {
            model: "openai/gpt-4o-mini",
            output_mode: "json_schema",
            top_logprobs: 20,
          },
          {
            model: "deepseek/deepseek-v3.2",
            output_mode: "instruction",
            top_logprobs: 20,
          },
        ],
      },
      profile: [1.0, 1.0, 1.0, 1.0, 1.0],
    },
  ],
};

export const ExampleInputs: ExampleInput[] = [
  // 1. Highly professional email to CEO - should score HIGH
  {
    value: {
      email:
        "Dear Mr. Thompson,\n\nI hope this message finds you well. I am writing to respectfully request a meeting at your earliest convenience to discuss the Q3 strategic initiatives. I have prepared a comprehensive analysis that I believe would be valuable for your review.\n\nPlease let me know a time that works best for your schedule. I am happy to accommodate any time that is convenient for you.\n\nThank you for your consideration.\n\nBest regards,\nSarah Chen",
      context: "Requesting a meeting with the company CEO",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 2. Extremely casual/inappropriate email to a client - should score LOW
  {
    value: {
      email:
        "yo whats up!! so like i was thinking about ur project and honestly its gonna be kinda hard lol. anyway hit me back whenever, no rush or w/e. laterrr",
      context: "Following up with a corporate client about their enterprise software contract",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 3. Friendly but professional email to colleague - should score HIGH
  {
    value: {
      email:
        "Hi Mike,\n\nHope you had a good weekend! Just wanted to check in on the design mockups - are we still on track for Wednesday? Let me know if you need any help or if anything's blocking you.\n\nThanks!\nJen",
      context: "Checking in with a teammate about project deliverables",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 4. Overly formal email to a close friend - should score MEDIUM-LOW
  {
    value: {
      email:
        "Dear Mr. Rodriguez,\n\nI am writing to formally inquire whether you would be amenable to attending a social gathering at my residence this coming Saturday evening. Light refreshments shall be provided. Please RSVP at your earliest convenience.\n\nYours sincerely,\nDavid",
      context: "Inviting my best friend from college to a casual weekend hangout",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 5. Angry/hostile email to customer support - should score LOW
  {
    value: {
      email:
        "ARE YOU SERIOUS RIGHT NOW?! I've been waiting THREE WEEKS for my order and nobody can tell me anything!! This is absolutely RIDICULOUS and I'm going to make sure everyone knows how terrible your company is. FIX THIS NOW!!!",
      context: "Inquiring about a delayed shipment with an online retailer's customer service",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 6. Professional apology email - should score HIGH
  {
    value: {
      email:
        "Dear Ms. Patel,\n\nI want to sincerely apologize for the delay in delivering the project specifications. I understand this has impacted your team's timeline, and I take full responsibility for the oversight.\n\nI have prioritized completing the remaining items and will have everything to you by end of day tomorrow. I have also put measures in place to ensure this does not happen again.\n\nThank you for your patience and understanding.\n\nRegards,\nTom Williams",
      context: "Apologizing to a client for missing a deadline",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 7. Passive-aggressive email to coworker - should score LOW
  {
    value: {
      email:
        "Hi Janet,\n\nAs per my LAST email (which you apparently didn't read), the files were due yesterday. I guess some of us have different definitions of 'deadline.' Anyway, whenever you decide to get around to it would be great. No pressure though, it's not like anyone else is waiting or anything.\n\nThanks SO much,\nRobert",
      context: "Reminding a coworker about overdue files",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 8. Warm professional email for job application follow-up - should score HIGH
  {
    value: {
      email:
        "Dear Hiring Team,\n\nThank you for taking the time to interview me last Thursday for the Marketing Manager position. I truly enjoyed learning more about the role and your company's vision.\n\nOur conversation reinforced my enthusiasm for the opportunity, and I believe my experience in digital campaigns would allow me to contribute meaningfully to your team.\n\nPlease don't hesitate to reach out if you need any additional information. I look forward to hearing from you.\n\nWarm regards,\nEmily Foster",
      context: "Following up after a job interview",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 9. Blunt/cold email when warmth is expected - should score MEDIUM-LOW
  {
    value: {
      email: "Received. Will review.",
      context:
        "Responding to a team member who just shared exciting news about completing a major project milestone",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
  // 10. Appropriately casual email between friends - should score HIGH
  {
    value: {
      email:
        "Hey! So pumped for the concert tomorrow - gonna be epic! Want to grab dinner before? I know a great taco spot near the venue. Let me know!\n\n- Alex",
      context: "Making plans with a close friend for a concert",
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: null,
  },
];
