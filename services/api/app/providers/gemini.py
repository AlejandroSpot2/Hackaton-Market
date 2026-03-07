from __future__ import annotations

import os

try:
    from google import genai
    from google.genai import types
    from pydantic import BaseModel
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    class BaseModel:
        pass

from ..models import RunResult, PulseSummary, MarketAtlas, CompetitorDetail, SummaryCard

def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not GEMINI_AVAILABLE or not api_key:
        return None
    return genai.Client(api_key=api_key)

class Phase1Response(BaseModel):
    pulse: PulseSummary
    atlas: MarketAtlas

class Phase2Response(BaseModel):
    competitor_details: dict[str, CompetitorDetail]
    brutal_truth: SummaryCard
    opportunity: SummaryCard

def generate_pulse(idea: str, match_data: list[dict]) -> Phase1Response | None:
    client = get_gemini_client()
    if not client:
        return None
        
    context = "\\n".join([f"Name: {c.get('title')}\\nURL: {c.get('url')}\\nContent: {c.get('text')}" for c in match_data])
        
    prompt = f"""
    You are an expert market analyst.
    Extract the core pulse and a market atlas (nodes and edges) for the following startup idea.
    
    Startup Idea: {idea}
    
    Competitor Data Context:
    {context}
    
    Output strictly conforming to the JSON schema. Ensure node types are exclusively: idea, competitor, segment, adjacent_category, opportunity.
    Edge types strictly: competes_with, belongs_to_segment, adjacent_to, opportunity_in.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-pro", # Use 2.5-pro since 3.1 is hypothetical for now or use 2.0-flash
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=Phase1Response,
                temperature=0.2,
            )
        )
        return response.parsed
    except Exception as e:
        print(f"Gemini Pulse generation failed: {e}")
        return None

def generate_deep_insights(idea: str, atlas: MarketAtlas, match_data: list[dict]) -> Phase2Response | None:
    client = get_gemini_client()
    if not client:
        return None
        
    context = "\\n".join([f"Name: {c.get('title')}\\nContent: {c.get('text')}" for c in match_data])
        
    prompt = f"""
    You are an elite venture capital partner. Synthesize the Brutal Truth and Opportunity based on the market atlas and competitor data.
    
    Startup Idea: {idea}
    Atlas Nodes: {[n.label for n in atlas.nodes]}
    
    Competitor Data Context:
    {context}
    
    Provide comprehensive insights conforming to the JSON schema.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=Phase2Response,
                temperature=0.6,
            )
        )
        return response.parsed
    except Exception as e:
        print(f"Gemini Deep Insights generation failed: {e}")
        return None
