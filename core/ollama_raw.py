import aiohttp
from config import constants

async def call_ollama_chat_api_with_non_streaming_response(session: aiohttp.ClientSession, model: str, messages: list):
    try:
        url = f"{constants.OLLAMA_HOST}:{constants.OLLAMA_PORT}/api/chat"
        headers = {
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options":{
                "num_predict": constants.OLLAMA_MAX_RESPONSE_TOKENS,
                "num_ctx": constants.OLLAMA_CONTEXT_SIZE,
                "temperature": constants.OLLAMA_DEFAULT_TEMPERATURE
            }
        }
        print("Making request to ollama generate API ...")
        print(f"curl -X POST {url} -d \'{payload}\' -H \"Content-Type: application/json\"")
        async with session.post(url=url, headers=headers, json=payload) as response:
            if response.status == 200:
                print("Ollama Generate API is successful !!!")
                json_response = await response.json()
                print(json_response)
                return json_response, None
            else:
                text_response = await response.text()
                print(text_response)
                return None, Exception(f"Ollama Generate API Failed with status code: {response.status}")
    except Exception as e:
        print(f"Error occured while making request to ollama generate API: {e}")
        return None, e
