// data for elizabot.js
// entries prestructured as laid out in Weizenbaum's description
// [cf: Communications of the ACM, Vol. 9, #1 (January 1966): p 36-45.]

var elizaInitials = [
    "How do you do.  Please tell me your problem.",
    // additions (not original)
    "Please tell me what's been bothering you.",
    "Is something troubling you ?"
];

var elizaFinals = [
    "Goodbye.  It was nice talking to you.",
    // additions (not original)
    "Goodbye.  This was really a nice talk.",
    "Goodbye.  I'm looking forward to our next session.",
    "This was a good session, wasn't it -- but time is over now.   Goodbye.",
    "Maybe we could discuss this moreover in our next session ?   Goodbye."
];

var elizaQuits = [
    "bye",
    "goodbye",
    "done",
    "exit",
    "quit"
];

var elizaPres = [
    "dont", "don't",
    "cant", "can't",
    "wont", "won't",
    "recollect", "remember",
    "recall", "remember",
    "dreamt", "dreamed",
    "dreams", "dream",
    "maybe", "perhaps",
    "certainly", "yes",
    "machine", "computer",
    "machines", "computer",
    "computers", "computer",
    "were", "was",
    "you're", "you are",
    "i'm", "i am",
    "same", "alike",
    "identical", "alike",
    "equivalent", "alike"
];

var elizaPosts = [
    "am", "are",
    "your", "my",
    "me", "you",
    "myself", "yourself",
    "yourself", "myself",
    "i", "you",
    "you", "I",
    "my", "your",
    "i'm", "you are"
];

var elizaSynons = {
    "be": ["am", "is", "are", "was"],
    "belief": ["feel", "think", "believe", "wish"],
    "cannot": ["can't"],
    "desire": ["want", "need"],
    "everyone": ["everybody", "nobody", "noone"],
    "family": ["mother", "mom", "father", "dad", "sister", "brother", "wife", "children", "child"],
    "happy": ["elated", "glad", "better"],
    "sad": ["unhappy", "depressed", "sick"]
};

var elizaKeywords = [

    /*
    Array of
    ["<key>", <rank>, [
        ["<decomp>", [
            "<reasmb>",
            "<reasmb>",
            "<reasmb>"
        ]],
        ["<decomp>", [
            "<reasmb>",
            "<reasmb>",
            "<reasmb>"
        ]]
    ]]
    */

    ["xnone", 0, [
        ["*", [
            "I'm not sure I understand you fully.",
            "Please go on.",
            "What does that suggest to you ?",
            "Do you feel strongly about discussing such things ?",
            "That is interesting.  Please continue.",
            "Tell me more about that.",
            "Does talking about this bother you ?"
        ]]
    ]],
    ["sorry", 0, [
        ["*", [
            "Please don't apologise.",
            "Apologies are not necessary.",
            "I've told you that apologies are not required.",
            "It did not bother me.  Please continue."
        ]]
    ]],
    ["apologise", 0, [
        ["*", [
            "goto sorry"
        ]]
    ]],
    ["remember", 5, [
        ["* i remember *", [
            "Do you often think of (2) ?",
            "Does thinking of (2) bring anything else to mind ?",
            "What else do you recollect ?",
            "Why do you remember (2) just now ?",
            "What in the present situation reminds you of (2) ?",
            "What is the connection between me and (2) ?",
            "What else does (2) remind you of ?"
        ]],
        ["* do you remember *", [
            "Did you think I would forget (2) ?",
            "Why do you think I should recall (2) now ?",
            "What about (2) ?",
            "goto what",
            "You mentioned (2) ?"
        ]],
        ["* you remember *", [
            "How could I forget (2) ?",
            "What about (2) should I remember ?",
            "goto you"
        ]]
    ]],
    ["forget", 5, [
        ["* i forget *", [
            "Can you think of why you might forget (2) ?",
            "Why can't you remember (2) ?",
            "How often do you think of (2) ?",
            "Does it bother you to forget that ?",
            "Could it be a mental block ?",
            "Are you generally forgetful ?",
            "Do you think you are suppressing (2) ?"
        ]],
        ["* did you forget *", [
            "Why do you ask ?",
            "Are you sure you told me ?",
            "Would it bother you if I forgot (2) ?",
            "Why should I recall (2) just now ?",
            "goto what",
            "Tell me more about (2)."
        ]]
    ]],
    ["if", 3, [
        ["* if *", [
            "Do you think it's likely that (2) ?",
            "Do you wish that (2) ?",
            "What do you know about (2) ?",
            "Really, if (2) ?",
            "What would you do if (2) ?",
            "But what are the chances that (2) ?",
            "What does this speculation lead to ?"
        ]]
    ]],
    ["dreamed", 4, [
        ["* i dreamed *", [
            "Really, (2) ?",
            "Have you ever fantasized (2) while you were awake ?",
            "Have you ever dreamed (2) before ?",
            "goto dream"
        ]]
    ]],
    ["dream", 3, [
        ["*", [
            "What does that dream suggest to you ?",
            "Do you dream often ?",
            "What persons appear in your dreams ?",
            "Do you believe that dreams have something to do with your problem ?"
        ]]
    ]],
    ["perhaps", 0, [
        ["*", [
            "You don't seem quite certain.",
            "Why the uncertain tone ?",
            "Can't you be more positive ?",
            "You aren't sure ?",
            "Don't you know ?",
            "How likely, would you estimate ?"
        ]]
    ]],
    ["name", 15, [
        ["*", [
            "I am not interested in names.",
            "I've told you before, I don't care about names -- please continue."
        ]]
    ]],
    ["deutsch", 0, [
        ["*", [
            "goto xforeign",
            "I told you before, I don't understand German."
        ]]
    ]],
    ["francais", 0, [
        ["*", [
            "goto xforeign",
            "I told you before, I don't understand French."
        ]]
    ]],
    ["italiano", 0, [
        ["*", [
            "goto xforeign",
            "I told you before, I don't understand Italian."
        ]]
    ]],
    ["espanol", 0, [
        ["*", [
            "goto xforeign",
            "I told you before, I don't understand Spanish."
        ]]
    ]],
    ["xforeign", 0, [
        ["*", [
            "I speak only English."
        ]]
    ]],
    ["hello", 0, [
        ["*", [
            "How do you do.  Please state your problem.",
            "Hi.  What seems to be your problem ?"
        ]]
    ]],
    ["computer", 50, [
        ["*", [
            "Do computers worry you ?",
            "Why do you mention computers ?",
            "What do you think machines have to do with your problem ?",
            "Don't you think computers can help people ?",
            "What about machines worries you ?",
            "What do you think about machines ?",
            "You don't think I am a computer program, do you ?"
        ]]
    ]],
    ["am", 0, [
        ["* am i *", [
            "Do you believe you are (2) ?",
            "Would you want to be (2) ?",
            "Do you wish I would tell you you are (2) ?",
            "What would it mean if you were (2) ?",
            "goto what"
        ]],
        ["* i am *", [
            "goto i"
        ]],
        ["*", [
            "Why do you say 'am' ?",
            "I don't understand that."
        ]]
    ]],
    ["are", 0, [
    ["* are you *", [
        "Why are you interested in whether I am (2) or not?",
        "Would you prefer if I weren't (2)?",
        "Perhaps I am (2), and perhaps I'm not.",
        "Is it important to you whether I am (2)?",
        "What makes you ask if I am (2)?"
    ]],
    ["* are you *", [
        "I'm not sure if I'm (2), but I might be.",
        "That's an interesting thought. Am I (2) in your eyes?",
        "Why do you ask if I am (2)?",
        "Is (2) something you're curious about?"
    ]]
]];
