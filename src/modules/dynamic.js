import { parseArgs } from "node:util";

const dynamic = async () => {
  try {
    const { positionals } = parseArgs({ allowPositionals: true });
    for (const fileName of positionals) {
      const plugin = await import(`./plugins/${fileName}.js`);
      console.log(plugin.run());
    }
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      console.log("Plugin not found");
    }
    process.exit(1);
  }
};

await dynamic();
