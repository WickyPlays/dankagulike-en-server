const { convertLinkToDownloadable } = require("../utils/converter.cjs");

module.exports.transformContent = function(content) {
  return {
    id: Number(content.id),
    contentType: Number(content.contentType),
    title: content.title,
    publisher: content.publisher,
    description: content.description,
    downloadUrl: convertLinkToDownloadable(content.downloadUrl),
    imageUrl: content.imageUrl,
    date: content.date,
    downloadCount: Number(content.downloadCount),
    voteAverageScore: Number(content.voteAverageScore),
    songInfo: JSON.parse(content.songInfo || '{"difficulties":[0,0,0,0,0],"hasLua":false}')
  };
};
