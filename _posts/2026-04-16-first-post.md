---
title: Give me formally verified toasters or give me death
date: 2026-04-16
excerpt: On the upcoming tsunami of AI-discovered vulnerabilities
---

Written while visiting a [friend](https://alok.github.io) at [Inkhaven](https://www.inkhaven.blog). Created this site, and wrote this post, in two hours. Needs some polish, but I stand by its contents.

# AI is pretty darn good at math

Yesterday, an artificial intelligence agent, GPT 5.4 Pro, did what mathematicians had long considered impossible:
GPT proved a conjecture which mathematicians had long considered interesting, and on which many had worked intermittently for years,
with a single prompt, no back-and-forth, and less than an hour and a half of wall-clock time.

The problem is the 1196th conjecture of Erdős (a famously prolific conjecturer, as the number shows),
and the original chat transcript is [here](https://chatgpt.com/share/69dd1c83-b164-8385-bf2e-8533e9baba9c) (note in particular "Thought for 80m 17s").

Some [comments from working mathematicians](https://www.erdosproblems.com/forum/thread/1196) are particularly illuminating:

* My former colleague Jared Lichtman, a number theorist at Stanford:
  > I care deeply about this problem, and I've been thinking about it for the past 7 years.
  > I'd frequently talk to Maynard about it in our meetings, and consulted over the years with several experts (Granville, Pomerance, Sound, Fox...) and others at Oxford and Stanford.
  > This problem was not a question of low-visibility per-se. Rather, it seems like a proof which becomes strikingly compact post-hoc, but the construction is quite special among many similar variations.
* Jared again, [elsewhere](https://x.com/jdlichtman/status/2044298382852927894):
  > The closest analogy I would give would be that the main openings in chess were well-studied, but AI discovers a new opening line that had been overlooked based on human aesthetics and convention.
* Terence Tao, widely considered the greatest living mathematician:
  > . . . the AI-generated paper inadvertently highlighted a tighter connection between two areas of mathematics . . . than had previously been made explicit in the literature (though there were hints and precursors scattered therein which one can see in retrospect).
  > That would be a meaningful contribution to the anatomy of integers that goes well beyond the solution of this particular Erdos problem.

Roon, the poet laureate of Silicon Valley, [sums](https://x.com/tszzl/status/2044442153833644102) it up: "seems like the first time the math community seems universally impressed with an ai proof"

Yet, despite the warranted fanfare surrounding the proof itself, the more interesting point is that this was not simply a case of agents brute-forcing a result.
In eighty minutes, an agent found a chess opening that humans hadn't considered, then kicked our ass with it.

Tony Feng, a number theorist at Berkeley, [makes](https://x.com/tonylfeng/status/2044214579350384710) this point:
"Impressive. We hear a lot about the jaggedness of AI capabilities, but in this case it feels like human mathematical understanding was jagged."

# Curry-Howard

K, great, but you're not a mathematician: who cares?

The rhetoric above, about jagged mathematical aptitude and blindness to novel strategies, reminds me of computer scientists' attitudes toward testing and edge cases.
Entire paradigms, like property-based testing, have been created and proselytized to further the notion that humans are particularly bad at thinking outside the box.
As a result, it should surprise no one that advanced AI models are finding vulnerabilities in longstanding systems, as has famously been alleged about Claude Mythos.

But there's a deeper connection between "mathematical" edge cases and "computational" edge cases.
There's a mysterious connection between pure math and ordinary programming that literally changed the course of my life when I first discovered it.
The concept is called the Curry-Howard correspondence, and, in short, it states that
*writing a program with some type signature* is **exactly** the same as *writing a proof of some statement*.
If you can show that some type "means" some statement and hand me a program that type-checks, then you've just proven to me, beyond any doubt, that you've told me the truth.

Because of this correspondence, we can take some programming language — say, C — and make a precise model of how it works:
for example, by translating the C standard into a few hundred very carefully constructed types that mean things like "undefined behavior happens here."
(This may sound absurd, but a group of very smart people have done it, building on the work of very funny French geniuses who named their language Coq. Both teams knew exactly what they were doing.)
Then, if you hand me your C code, I can prove things about it: for example, it doesn't crash, and it outputs 42, no matter how or where it's run.
I can do this once and for all, without ever running your program, and the only requirement is that I'm sufficiently good at math.

The problem is that this particular kind of math, writing down exact programs and types, is almost unbearably long-winded. Translating the proof of the four-color theorem took five years.

# Takeoff

This is a somewhat sad state of affairs. We have a giant orbital laser that can erase all bugs from orbit, but no one can figure out the right settings to turn it on.
It's like [we went to space with two broken Microsoft Outlook installs](https://www.404media.co/artemis-2-astronauts-microsoft-outlook-livestream/).
With that in mind, I was beyond excited to join Math, Inc., a real company that's really named that, to work on dedicated AI agents to write formalizations automatically.
I left a few months ago, but not before making vast progress on an agent we named Gauss, which went on to formalize Maryna Viazovska's Fields Medal-winning result on optimal sphere packing in both 8 and 24 dimensions.
The [final pull request](https://github.com/thefundamentaltheor3m/Sphere-Packing-Lean/pull/341) before an airtight proof added more than fifty two thousand lines of code.

# OK, what's this all really about?

These formal verification agents are publicly accessible. Harmonic's Aristotle, for example, is even free. This seems like a great state of affairs! Everyone will prove their favorite open-source project formally correct!

Except one thing. Your favorite project is almost certainly *not* correct. And what happens when these verification systems can't find a proof, but they know why? They hand you a refutation.

What does a refutation look like, if your question was "is the Linux kernel secure?"
