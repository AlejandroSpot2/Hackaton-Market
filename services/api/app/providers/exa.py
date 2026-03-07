from __future__ import annotations

import os
from typing import Any

# For Hackathon purposes, if the exa_py library is not installed, we mock the network call
# but return the expected struct. In production, pip install exa_py
try:
    from exa_py import Exa
    EXA_AVAILABLE = True
except ImportError:
    EXA_AVAILABLE = False

def search_competitors(query: str, max_results: int = 5) -> list[dict[str, Any]]:
    """
    Finds real competitors using Exa's neural search engine.
    Extracts text contents to be passed into Gemini.
    """
    api_key = os.getenv("EXA_API_KEY")
    if not EXA_AVAILABLE or not api_key:
        print("Warning: Exa is unavailable or EXA_API_KEY not set. Using fallback competitor data.")
        return _mock_exa_results(query)

    try:
        exa = Exa(api_key=api_key)
        # Search for companies using neural search
        response = exa.search_and_contents(
            query,
            type="neural",
            category="company",
            num_results=max_results,
            text=True,
            highlights=True
        )
        
        results = []
        for doc in response.results:
            results.append({
                "title": getattr(doc, "title", "Unknown"),
                "url": getattr(doc, "url", ""),
                "text": getattr(doc, "text", "")[:2000],  # Truncate for LLM window
                "highlights": getattr(doc, "highlights", [])
            })
        return results
    except Exception as e:
        print(f"Exa search failed: {e}")
        return _mock_exa_results(query)

def _mock_exa_results(query: str) -> list[dict[str, Any]]:
    return [
        {
            "title": f"Competitor Alpha for {query}",
            "url": "https://alpha.example.com",
            "text": "We are the leading provider in this space, offering AI-driven solutions.",
            "highlights": ["AI-driven solutions"]
        },
        {
            "title": f"Beta Startup for {query}",
            "url": "https://beta.example.com",
            "text": "Beta is disrupting the industry with an innovative approach to workflow.",
            "highlights": ["innovative approach"]
        }
    ]
