import re
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

file_name = "559161719.log"


def countWords(file_name, time=[]):
    word_list = {}

    with open(file_name, "r") as f:
        for line in f:
            words = re.split(r'\W+', line)

            for word in words[5:-1]:
                if word.lower() in word_list:
                    word_list[word.lower()] += 1
                else:
                    word_list[word.lower()] = 1

    return [[k, v] for k, v in sorted(word_list.items(), key=lambda item: -item[1])]


sorted_list = np.array(countWords(file_name))
x = sorted_list[:, 0]
y = sorted_list[:, 1]

print(x)
print(y)

sns.barplot(x = x[:10], y = y[:10])   