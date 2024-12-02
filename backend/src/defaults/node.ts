export const basePrompt = `
<boltArtifact id="project-import" title="Node.js Starter">
  <boltAction type="file" filePath="index.js">
    // Entry point for the Node.js application
    console.log(\`Hello Node.js v\${process.versions.node}!\`);
  </boltAction>
  <boltAction type="file" filePath="package.json">
    {
      "name": "node-starter",
      "private": true,
      "version": "1.0.0",
      "scripts": {
        "start": "node index.js",
        "test": "echo \\"Error: no test specified\\" && exit 1"
      }
    }
  </boltAction>
</boltArtifact>
`;
