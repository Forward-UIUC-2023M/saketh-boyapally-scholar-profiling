from utils import scrape_google, split_sen, get_text, multiclass

import spacy

nlp = spacy.load("en_core_web_sm")

# def clean_data(data):
#     cleaned_data = {'awd': [], 'edu': [], 'int': [], 'pos': []}

#     for key in data.keys():
#         for sentence in data[key]:
#             doc = nlp(sentence)

#             clean_sentence = []
#             for ent in doc.ents:
#                 if key == 'awd':
#                     if ent.label_ in ['ORG', 'EVENT', 'DATE']:
#                         clean_sentence.append(ent.text)

#                 elif key == 'edu':
#                     if ent.label_ in ['ORG', 'DATE']:
#                         clean_sentence.append(ent.text)

#                 elif key == 'int':
#                     if ent.label_ in ['NORP', 'ORG', 'GPE', 'PRODUCT', 'EVENT', 'WORK_OF_ART', 'LAW']:
#                         clean_sentence.append(ent.text)

#                 elif key == 'pos':
#                     if ent.label_ in ['ORG', 'GPE', 'DATE']:
#                         clean_sentence.append(ent.text)

#             # add sentence to cleaned_data if it's not empty
#             if clean_sentence:
#                 cleaned_data[key].append(' '.join(clean_sentence))

#     return cleaned_data

def scholar_search(name):
    # final_dict = {}
    # awd = []
    # edu = []
    # interest = []
    # position = []

    # for link in scrape_google(name):
    #     texts = split_sen(get_text(link))
    #     if texts is not None:
    #         for t in texts:
    #             pred = multiclass(t)
    #             if pred == 0:
    #                 awd.append(t)
    #             elif pred == 1:
    #                 edu.append(t)
    #             elif pred == 2:
    #                 interest.append(t)
    #             elif pred == 3:
    #                 position.append(t)
    #     else:
    #         continue
    # final_dict["awd"] = awd
    # final_dict["edu"] = edu
    # final_dict["int"] = interest
    # final_dict["pos"] = position
    # return final_dict
    return scrape_google(name)

def url_search(urls):
    final_dict = {}
    awd = []
    edu = []
    interest = []
    position = []

    for link in urls:
        texts = split_sen(get_text(link))
        if texts is not None:
            for t in texts:
                pred = multiclass(t)
                if pred == 0:
                    awd.append(t)
                elif pred == 1:
                    edu.append(t)
                elif pred == 2:
                    interest.append(t)
                elif pred == 3:
                    position.append(t)
        else:
            continue

    final_dict["awd"] = awd
    final_dict["edu"] = edu
    final_dict["int"] = interest
    final_dict["pos"] = position

    return final_dict




# urls = scholar_search("Kevin Chen-Chuan Chang")
# raw_data = url_search(urls)
# print(raw_data)

