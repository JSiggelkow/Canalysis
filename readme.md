# Canalysis
Canalysis lets you analyze multiple PDF files within seconds. 
Define keywords to search through scientific literature and automatically compile only the relevant pages into a single file.
Use AI to run qualitative analyses on your compiled content and receive a structured report
or bring your own prompts and let the AI work the way you need it to.

## Installation Guide
1. Install Docker: https://docs.docker.com/engine/install/
2. Clone the repository: https://github.com/JSiggelkow/Canalysis
3. Create ```.env``` file in root directory
4. Add your OpenAI API key to ```.env``` file: ```OPENAI_API_KEY=```
5. Crate DB Password in ```.env``` file: ```DB_PASSWORD=```
6. Run ```docker-compose up```

## Usage Guide
#### Step 1
* Upload any ```.pdf``` files

#### Step 2
* Add keywords to search for
* Search for keywords

#### Step 3
* Compose keyword matching pages into a single file

#### Step 4
* Create a prompt to analyze the composed file
* Run the prompt
* download the report


