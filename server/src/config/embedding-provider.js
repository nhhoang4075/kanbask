import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.backends.onnx.verbose = false;
env.remoteHost = "https://huggingface.co";

const modelName = "Xenova/all-MiniLM-L6-v2";
let embeddingPipelinePromise = null;

const getEmbeddingPipeline = async () => {
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
};

const generateEmbedding = async (text) => {
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
};

const initialize = async () => {
  try {
    await getEmbeddingPipeline();
  } catch (error) {
    throw error;
  }
};

export default { generateEmbedding, initialize };
