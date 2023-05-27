import docx2txt
import re
import os

def rawParserHelper():
    # Prompt the user for a file name
    print("Type the filename of the raw docx document: ")
    file_name = input()

    # Extract the base name of the file (without extension)
    base_name = os.path.splitext(file_name)[0]

    # Extract text from the specified .docx file
    text = docx2txt.process(file_name)

    # Remove spaces, newlines and tabs
    text = text.replace('\t', ' ').replace('  ', ' ').replace('  ', ' ')

    # Replace multiple spaces with a single space
    text = re.sub(' +', ' ', text)
    text2 = re.sub('\\n\\n+', '\n', text)

    # Write the extracted text to a new file
    with open(base_name + "-filtered.txt", "w", encoding="utf-8") as f:
        f.write(text2)

    # Print the extracted text
    print(text2)

rawParserHelper()