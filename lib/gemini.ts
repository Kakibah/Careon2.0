import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    profileAnalysis: {
      type: Type.OBJECT,
      properties: {
        analysis: { type: Type.STRING },
        coreStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        potentialWeaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        personalityFit: { type: Type.STRING }
      },
      required: ["analysis", "coreStrengths", "potentialWeaknesses", "personalityFit"]
    },
    careerPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          whyFit: { type: Type.STRING },
          responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
          salaryRange: {
            type: Type.OBJECT,
            properties: {
              entry: { type: Type.STRING },
              experienced: { type: Type.STRING }
            },
            required: ["entry", "experienced"]
          },
          industries: { type: Type.ARRAY, items: { type: Type.STRING } },
          futureOutlook: { type: Type.STRING, enum: ["growing", "stable", "declining"] }
        },
        required: ["title", "whyFit", "responsibilities", "salaryRange", "industries", "futureOutlook"]
      }
    },
    skillsRequired: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          careerTitle: { type: Type.STRING },
          technical: { type: Type.ARRAY, items: { type: Type.STRING } },
          soft: { type: Type.ARRAY, items: { type: Type.STRING } },
          tools: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["careerTitle", "technical", "soft", "tools"]
      }
    },
    developmentRoadmap: {
      type: Type.OBJECT,
      properties: {
        months1_3: { type: Type.ARRAY, items: { type: Type.STRING } },
        months4_6: { type: Type.ARRAY, items: { type: Type.STRING } },
        months7_9: { type: Type.ARRAY, items: { type: Type.STRING } },
        months10_12: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["months1_3", "months4_6", "months7_9", "months10_12"]
    },
    projectIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          careerPath: { type: Type.STRING, description: "The career path this project is for" },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                skillsDemonstrated: { type: Type.ARRAY, items: { type: Type.STRING } },
                portfolioValue: { type: Type.STRING }
              },
              required: ["title", "description", "skillsDemonstrated", "portfolioValue"]
            }
          }
        },
        required: ["careerPath", "projects"]
      }
    },
    internshipStrategy: {
      type: Type.OBJECT,
      properties: {
        whereToSearch: { type: Type.ARRAY, items: { type: Type.STRING } },
        targetCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
        howToStandOut: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["whereToSearch", "targetCompanies", "howToStandOut"]
    },
    learningResources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["course", "book", "article", "platform", "video"] },
          provider: { type: Type.STRING },
          link: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["beginner", "intermediate", "advanced"] },
          relevance: { type: Type.STRING, description: "Why this is recommended for the user's roadmap" }
        },
        required: ["title", "type", "provider", "link", "difficulty", "relevance"]
      }
    },
    longTermTrajectory: {
      type: Type.OBJECT,
      properties: {
        years1_2: { type: Type.STRING },
        years3_5: { type: Type.STRING },
        years6_10: { type: Type.STRING }
      },
      required: ["years1_2", "years3_5", "years6_10"]
    },
    expertInterviewQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          idealAnswer: { type: Type.STRING },
          whyItIsAsked: { type: Type.STRING }
        },
        required: ["question", "idealAnswer", "whyItIsAsked"]
      }
    },
    advancedPortfolioTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "profileAnalysis",
    "careerPaths",
    "skillsRequired",
    "developmentRoadmap",
    "projectIdeas",
    "internshipStrategy",
    "learningResources",
    "longTermTrajectory",
    "expertInterviewQuestions",
    "advancedPortfolioTips"
  ]
};

export async function generateCareerRoadmap(userData: any) {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Analyze the following user profile and generate a structured career roadmap.
    
    USER PROFILE:
    Name: ${userData.name}
    Age: ${userData.age}
    Country: ${userData.country}
    Education: ${userData.education}
    Major: ${userData.major}
    University: ${userData.university || "N/A"}
    Skills: ${userData.skills}
    Enjoyed Subjects: ${userData.enjoyedSubjects}
    Disliked Topics: ${userData.dislikedTopics}
    Personality: ${userData.personality}
    Career Interests: ${userData.careerInterests}
    Preferred Industries: ${userData.preferredIndustries}
    Salary Expectations: ${userData.salaryExpectations || "N/A"}
    Work Style: ${userData.workStyle}
    Long-term Ambitions: ${userData.ambitions}
    
    Act as a combination of a career strategist, labor market analyst, and professional mentor.
    Provide practical, data-driven guidance. Avoid vague motivational advice.
    For 'projectIdeas', ensure you provide a group of at least 3-4 distinct projects for EVERY career path listed in 'careerPaths'.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        systemInstruction: "You are an advanced AI Career Navigator. Your goal is to provide structured, realistic, and data-driven career guidance for university students and early professionals (ages 18–30). Focus on practical guidance, real job roles, skills required, salary expectations, and a realistic timeline. For learning resources, provide specific, high-quality recommendations (courses, books, etc.) with realistic links and clear difficulty levels."
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}
