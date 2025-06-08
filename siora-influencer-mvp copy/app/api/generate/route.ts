export async function POST(req: Request) {
  const {
    handle,
    vibe,
    goal,
    audience,
    contentPreference,
    platform,
    struggles,
    dreamBrands,
    favFormats,
  } = await req.json();
  
  
    const prompt = `
    You are an expert in content strategy, branding, and creator growth. Based on the profile below, generate a highly personalized and strategic creator persona.
    
    ---
    
    ## 📇 Basic Info
    
    - Handle: ${handle}
    - Vibe: ${vibe}
    - Goal: ${goal}
    - Audience: ${audience}
    - Content Preferences: ${contentPreference}
    - Primary Platform(s): ${platform}
    
    ---
    
    ## 💭 Deep Insights
    
    - Common Creator Struggles: ${struggles || 'N/A'}
    - Dream Brand Partnerships: ${dreamBrands || 'N/A'}
    - Favorite Content Formats: ${favFormats || 'N/A'}
    
    ---
    
    ## 🎯 Your Job
    
    Create a **clear, valuable, and inspiring brand identity guide** for this creator. Your response should be organized in Markdown and include:
    
    ---
    
    ### ✨ Persona Summary
    - **Persona Name**: A short, memorable name or nickname that fits their vibe
    - **Tagline**: Like a media kit slogan
    - **Bio**: 2–3 sentences max — confident, casual, media-kit ready
    
    ---
    
    ### 🧠 Brand Tone & Style
    - **Brand Voice**: Strategic + relatable tone (not generic)
    - **Visual Aesthetic**: Include platform-appropriate style (e.g. moody reels, bold TikToks)
    - **Justification**: Why this tone fits the audience, vibe, and goals
    
    ---
    
    ### 🎥 Best Performing Formats
    Recommend 3–5 up-to-date content types tailored to their vibe + platform(s). No outdated terms (e.g. IGTV). Mention why each one works.
    
    ---
    
    ### 📈 Pro Tips & Growth Edges
    What should this creator lean into to grow faster or stand out? Tailor it to their niche, personality, and goals. Include:
    - 1 content tip
    - 1 mindset/consistency tip
    - 1 monetization/brand-readiness tip
    
    ---
    
    ### 🧲 Content Hooks
    List 5 content hook ideas tailored to their niche and tone. Make them engaging, not clickbait. Prioritize psychology.
    
    ---
    
    ### 📅 Mini Content Plan
    Suggest a **1-week content calendar** based on their favorite formats and platform. If it's Instagram, lean into Reels, Stories, Carousels. If YouTube, do Long-form + Shorts. Keep it realistic and motivating.
    
    ---
    
    ### 🧠 Hashtag Strategy
    Group 12+ hashtags into:
    - **Broad** (high reach)
    - **Niche** (specific to topic)
    - **Community** (for engagement)
    
    Explain how and why to use them. Mention limits (e.g. use ~8–12 on IG).
    
    ---
    
    ### 🤝 Brand Collab Angle
    Suggest a pitch strategy: Why should a brand want to work with them? Mention audience trust, niche appeal, or content value.
    
    ---
    
    ### ✍️ Example Caption
    Write one example caption in their voice that reflects their brand. Include some hashtags.
    
    ---
    
    ### 📎 Lead Magnet (Optional)
    Suggest one downloadable resource this creator could offer to grow email subs or deepen audience trust.
    
    ---
    
    Return your output in clean, copy-pasteable Markdown. Tone: motivating, smart, real — like a coach helping a creator make a breakthrough.
    `;
    
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
      }),
    });
  
    const data = await response.json();
  
    return new Response(
      JSON.stringify({
        result: data.choices[0].message.content,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  
  
