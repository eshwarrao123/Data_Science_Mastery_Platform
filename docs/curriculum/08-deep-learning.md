# Domain 8 — Deep Learning

| Field | Value |
|---|---|
| Course slug | `deep-learning` |
| Order | 8 |
| Category | Deep Learning |
| Difficulty | Intermediate → Advanced |
| Estimated hours | 20 |
| Prerequisites | Machine Learning + Linear Algebra + Chain Rule (calculus) |

Neural networks from the perceptron to transformers, with PyTorch as the
implementation vehicle.

## Learning outcomes

- Explain forward/backward propagation and what training actually does
- Build, train, validate, and persist networks in PyTorch
- Apply CNNs and transfer learning to image data
- Model sequences with RNNs/LSTMs
- Explain attention and the transformer architecture at interview depth

## Modules

| Order | Slug | Title |
|---|---|---|
| 1 | `fundamentals` | Neural Network Fundamentals |
| 2 | `pytorch` | PyTorch |
| 3 | `cnns` | Convolutional Neural Networks |
| 4 | `rnns` | Recurrent Neural Networks |
| 5 | `transformers` | Transformers |

## Lessons — module `fundamentals`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 8.1 | What Is a Neural Network? | `what-is-a-neural-network` | Intermediate | 30 min | 80 | `machine-learning.foundations.what-is-machine-learning` | neurons, layers, why depth | planned |
| 8.2 | Perceptrons & Activation Functions | `perceptrons-and-activations` | Intermediate | 35 min | 80 | `deep-learning.fundamentals.what-is-a-neural-network` | perceptron, ReLU/sigmoid/tanh, nonlinearity | planned |
| 8.3 | Forward Propagation | `forward-propagation` | Advanced | 40 min | 90 | `deep-learning.fundamentals.perceptrons-and-activations` | matrix flow, shapes, predictions | planned |
| 8.4 | Backpropagation | `backpropagation` | Advanced | 45 min | 100 | `math-statistics.calculus.the-chain-rule` | gradients through layers, chain rule applied | planned |
| 8.5 | Training: Loss & Optimizers | `training-loss-optimizers` | Advanced | 40 min | 100 | `deep-learning.fundamentals.backpropagation` | loss functions, SGD/Adam, epochs/batches | planned |

## Lessons — module `pytorch`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 8.6 | PyTorch Tensors & Autograd | `pytorch-tensors-and-autograd` | Advanced | 40 min | 90 | `deep-learning.fundamentals.training-loss-optimizers` | tensors, autograd, device placement | planned |
| 8.7 | Building Your First Neural Network | `building-your-first-nn` | Advanced | 45 min | 100 | `deep-learning.pytorch.pytorch-tensors-and-autograd` | nn.Module, layers, forward | planned |
| 8.8 | Training Loop & Validation | `training-loop-and-validation` | Advanced | 40 min | 100 | `deep-learning.pytorch.building-your-first-nn` | training loop, DataLoader, early stopping | planned |
| 8.9 | Saving & Loading Models | `saving-and-loading-models` | Advanced | 25 min | 80 | `deep-learning.pytorch.training-loop-and-validation` | state_dict, checkpoints, eval mode | planned |

## Lessons — module `cnns`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 8.10 | Image Data & Preprocessing | `image-data-and-preprocessing` | Advanced | 35 min | 90 | `deep-learning.pytorch.training-loop-and-validation` | tensors from images, normalization, augmentation | planned |
| 8.11 | CNN Architecture | `cnn-architecture` | Advanced | 45 min | 100 | `deep-learning.cnns.image-data-and-preprocessing` | convolutions, pooling, feature maps | planned |
| 8.12 | Transfer Learning | `transfer-learning` | Advanced | 40 min | 100 | `deep-learning.cnns.cnn-architecture` | pretrained backbones, fine-tune vs freeze | planned |
| 8.13 | 🏗 Project: Image Classification | `project-image-classification` | Advanced | 120 min | 300 | `deep-learning.cnns.transfer-learning` | end-to-end vision pipeline | planned |

## Lessons — module `rnns`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 8.14 | Sequence Data Concepts | `sequence-data-concepts` | Advanced | 30 min | 80 | `deep-learning.pytorch.training-loop-and-validation` | sequences, windows, order sensitivity | planned |
| 8.15 | RNN Architecture | `rnn-architecture` | Advanced | 40 min | 100 | `deep-learning.rnns.sequence-data-concepts` | recurrence, hidden state, vanishing gradients | planned |
| 8.16 | LSTM & GRU | `lstm-and-gru` | Advanced | 40 min | 100 | `deep-learning.rnns.rnn-architecture` | gates, long-range memory | planned |
| 8.17 | 🏗 Project: Time Series Forecasting | `project-time-series-forecasting` | Advanced | 120 min | 300 | `deep-learning.rnns.lstm-and-gru` | sequence model end-to-end | planned |

## Lessons — module `transformers`

| # | Title | Slug | Difficulty | Time | XP | Prerequisite | Key concepts | Status |
|---|---|---|---|---|---|---|---|---|
| 8.18 | The Attention Mechanism | `attention-mechanism` | Advanced | 45 min | 100 | `math-statistics.linear-algebra.dot-products` | queries/keys/values, attention weights | planned |
| 8.19 | Transformer Architecture | `transformer-architecture` | Advanced | 45 min | 110 | `deep-learning.transformers.attention-mechanism` | self-attention, positional encoding, blocks | planned |
| 8.20 | BERT & GPT Concepts | `bert-and-gpt-concepts` | Advanced | 35 min | 100 | `deep-learning.transformers.transformer-architecture` | encoder vs decoder, pretraining objectives | planned |
| 8.21 | Fine-Tuning a Pretrained Model | `fine-tuning-pretrained-model` | Advanced | 45 min | 110 | `deep-learning.transformers.bert-and-gpt-concepts` | Hugging Face flow, task heads | planned |

Domain status: 0/21 implemented. Exercise ID prefix: `dl01`–`dl21`.
