import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.backends.onnx.verbose = false;
env.remoteHost = "https://huggingface.co";

let embeddingPipelinePromise = null;
const modelName = "Xenova/all-MiniLM-L6-v2";

async function getEmbeddingPipeline() {
  if (embeddingPipelinePromise === null) {
    embeddingPipelinePromise = pipeline("feature-extraction", modelName, {
      quantized: true
    })
      .then((pipelineInstance) => {
        return pipelineInstance;
      })
      .catch((err) => {
        embeddingPipelinePromise = null;
        throw err;
      });
  }
  return embeddingPipelinePromise;
}

async function generateEmbedding(text) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return null;
  }

  try {
    const extractor = await getEmbeddingPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const embeddingVector = Array.from(output.data);
    return embeddingVector;
  } catch (error) {
    throw error;
  }
}

async function initialize() {
  try {
    await getEmbeddingPipeline();
  } catch (error) {}
}

export { generateEmbedding, initialize };
