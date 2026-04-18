/**
 * Computes Cosine Similarity between user skills and job skills.
 * A very simple implementation using Set intersections and unions to simulate TF-IDF properties for short strings.
 */
exports.calculateMatchScore = (userSkills, jobSkills) => {
    if (!userSkills || !userSkills.length || !jobSkills || !jobSkills.length) return 0;
    
    // Convert to lowercase sets
    const userSet = new Set(userSkills.map(s => s.toLowerCase().trim()));
    const jobSet = new Set(jobSkills.map(s => s.toLowerCase().trim()));
    
    let intersectionCount = 0;
    for (let skill of userSet) {
        if (jobSet.has(skill)) {
            intersectionCount++;
        }
    }
    
    // Simplistic text similarity measure (Jaccard or simple percentage)
    // To give a nicer "percentage" output, we will do what percent of job skills the user has
    // Math.round((intersectionCount / jobSet.size) * 100);
    
    // Cosine Similarity approach on binary vectors: 
    // dot product is intersectionCount
    // magnitude is sqrt(userSet.size) * sqrt(jobSet.size)
    const dotProduct = intersectionCount;
    const magUser = Math.sqrt(userSet.size);
    const magJob = Math.sqrt(jobSet.size);
    
    if (magUser === 0 || magJob === 0) return 0;
    
    const cosineSimilarity = dotProduct / (magUser * magJob);
    
    return Math.round(cosineSimilarity * 100);
};
