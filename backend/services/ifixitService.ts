
export class IFixitService {
  private baseUrl = "https://www.ifixit.com/api/2.0";

  async searchDevice(query: string) {
    const response = await fetch(`${this.baseUrl}/search/${encodeURIComponent(query)}?filter=device`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.results?.slice(0, 3).map((d: any) => ({
      title: d.display_title || d.title,
      url: d.url
    }));
  }

  async listTopics(deviceTitle: string) {
    const response = await fetch(`${this.baseUrl}/wikis/CATEGORY/${encodeURIComponent(deviceTitle)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.guides?.slice(0, 5).map((g: any) => ({
      id: g.guideid,
      title: g.title,
      summary: g.summary
    }));
  }

  async getGuideDetails(guideId: string) {
    const response = await fetch(`${this.baseUrl}/guides/${guideId}`);
    if (!response.ok) return null;
    const data = await response.json();
    
    // Cleanup: Only return text and image links
    const cleanedSteps = data.steps?.map((step: any, index: number) => {
      const text = step.lines.map((l: any) => l.text_raw).join(' ');
      const image = step.media?.images?.[0]?.original || null;
      return `Step ${index + 1}: ${text} ${image ? `[Image: ${image}]` : ''}`;
    }).join('\n\n');

    return {
      title: data.title,
      steps: cleanedSteps,
      url: data.url
    };
  }
}
