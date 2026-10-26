---
title: Language Modeling
description: How language models predict the next word.
unit: 8
---

Welcome to the Language Modeling section of the i2 Course! Here you will learn
about the core concepts underlying textual GenAI tools that took the world by
storm. Hopefully you can reason about these models better after learning more
about how they work!

---

## Technical Track Content

### Task 1

*Navigate to the relevant section of the i2 Grimoire using the link below. Read the textbook and answer all synthesis questions to the best of your ability. Be sure to save these somewhere for future reference.*

[i2 Grimoire: Language Modeling](https://grimoire.uw-i2.org/units/Language%20Modeling.pdf)

### Task 2

*Solve the coding challenges within the Jupyter notebook linked below (through Colab). If you encounter any issues with the notebook not functioning as described, please let us know!*

Please ask questions as you work through this project. Be sure to discuss with others in your group if you have one! Share your answers as you like, the goal is to learn and we’re not holding grades over your head.

**There are 2 parts (.ipynb files) to this unit. Try to finish both.** This technical project is likely to be harder than anything you have done in this course before, so be patient with it and reach out if you need support! In the first part, you wll be learning how to work with the HuggingFace API.

**Colab Link:** [Language Modeling Colab Notebook Part 1](https://colab.research.google.com/github/interactive-intelligence/intro-neuro-ai-website/blob/main/notebooks/unit-08/hf_tutorial.ipynb) **(1 hr)**

Now navigate to the application portion of this project (Part 2 below), where you are given a dataset and asked to train an LLM of your choice to emulate Shakespeare! Be sure to reference your the above notebook to figure out how to do this.

**Colab Link:** [Language Modeling Colab Notebook Part 2](https://colab.research.google.com/github/interactive-intelligence/intro-neuro-ai-website/blob/main/notebooks/unit-08/lm_starter_code.ipynb) **(1 hr)**

When you are finished with your code, independently verify that it works and have fun with it! If you add any additional functionality be sure to talk about it with others and give them ideas.

Remember that this is all for your learning, so do your best and don’t stress!

Congratulations! You now understand the basics of HuggingFace and Language Modeling!

---

## Literacy Track Content

### Task 1

*Read the article below, and answer any synthesis questions placed along the way.*

This article will cover the idea of language modeling and how computers process human language.

Put simply, the goal of language modeling is to predict the next word in a sentence using information about the definitions and grammatical rules of particular words as well as the contexts in which they appear.

For example consider this sentence:
> I want to cook an omelet, so I went to the store to buy some ___

What comes next in this sentence? Chances are, you said “eggs.” There are plenty of “correct” answers—maybe you were out of salt and pepper—but it’s the most likely answer. Based on the sentence, we know that whatever comes next should be a noun phrase, and it’s probably related to the omelet we’re going to cook, and it’s something you can buy in a store. Given all that information, we conclude that we can fill in the blank with “eggs.” The goal of language modeling is to do something similar—that is, predict the next word in these sentences using probabilistic information about the sentence.

There are two main types of language models: **statistical language models** and **neural language models**.

Statistical language models use statistics and probability directly to predict the likely next word in a sentence of phrase. They generally get these statistics from a sample set of data. Based on this data, the model can identify patterns in the text and come up with predictions.

Statistical language models usually take the form of an **n-gram model**. This model predicts the probability of a word in a sequence given the n previous words in the sequence. For example, a unigram predicts the probability of a word given the immediate previous word; a bigram predicts the probability given the two previous words; a trigram uses the three previous words, and so on.

However, statistical language models have their limitations. For one, they will struggle with new words or phrases that don’t appear often in the original set of data (for example, if the phrase “time complexity” rarely appears in the original data, the model may struggle to predict that the word “complexity” can follow the word “time”). In addition, because these models look back at a fixed number of words, they can struggle to track and consider the long-term effects of a word on a phrase.

This is where the other type of model, neural language models, come in. Neural language models use neural networks to predict the next word in a sequence. These models are able to handle more complex and diverse sets of training data and are better at handling context clues and long-term effects of words.

We’ll continue to discuss neural language models in greater detail through these videos. Specifically, we’ll look at two types of neural language models: **recurrent neural networks** and **transformers**. Watch the following videos!

### Video 1: [Illustrated Guide to Recurrent Neural Networks: Understanding the Intuition](https://www.youtube.com/watch?v=LHXXI4-IEns) (10 min)

<iframe src="https://www.youtube-nocookie.com/embed/LHXXI4-IEns" title="Illustrated Guide to Recurrent Neural Networks: Understanding the Intuition" loading="lazy" allowfullscreen></iframe>

### Synthesis Questions

* How does an RNN interact with a feed-forward neural network? What role does the RNN play in this process?
* Describe the vanishing gradient problem in your own words. Does it relate to the drawbacks of statistical language models?
* The video describes a few solutions to the short-term memory of RNNs. What changes do they make to address the problem?

### Video 2: [Transformers, explained: Understand the model behind GPT, BERT, and T5](https://www.youtube.com/watch?v=SZorAJ4I-sA) (9 min)

<iframe src="https://www.youtube-nocookie.com/embed/SZorAJ4I-sA" title="Transformers, explained: Understand the model behind GPT, BERT, and T5" loading="lazy" allowfullscreen></iframe>

### Synthesis Questions

* What are some of the limitations of previous NLP models, and how did transformers address these?
* Describe the ideas of positional encoding and attention in your own words.
* Like the “server” example at 6:50 in the video, create two sentences that can be disambiguated using self-attention.

### Optional: [Natural Language Processing: Crash Course AI #7](https://www.youtube.com/watch?v=oi0JXuL19TA&list=PL8dPuuaLjXtO65LeD2p4_Sb5XQ51par_b&index=8) (13 min)

**Great resource if you're still having trouble with NLP!**

<iframe src="https://www.youtube-nocookie.com/embed/oi0JXuL19TA" title="Natural Language Processing: Crash Course AI #7" loading="lazy" allowfullscreen></iframe>

### Task 2

*Complete the following writing activity.*

The non-technical project for this unit will involve some writing! **Choose 3** of the prompts below and write **at least 200** (_meaningful!_) words on each one! We will not be strictly grading you on correctness or anything like that. This is an opportunity to deeply engage with the material you have just learned about, and creatively connect it to neuroscience!

* What ethical considerations arise when developing language models that are inspired by neural processes involved in language?
* To what extent do models used in language processing reflect the actual neural networks involved with language tasks in the brain?
* How can insights from neuroscience be leveraged to enhance the design and development of language models?
* Reflecting on you learning from this unit, what is the one thing you found to be most interesting?
* What is one concept from this unit that you would like to learn more about and why?
