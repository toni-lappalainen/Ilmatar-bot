module.exports = async (client, member) => {
  // TODO: server and channels and messages from file!

  if (member.guild.id != client.config.PSILO_ID) return;

  const channel = member.guild.channels.cache.find(
    (c) => c.name === "tervetuloa",
  );

  channel.send(`Tervetuloa, ${member}! 

**RYHMÄN SÄÄNNÖT:**

1 § Psilosybiini.info-chatryhmä on tarkoitettu vain täysi-ikäisille henkilöille.

2 § Ylläpitäjille ei tule lähettää yksityisviestejä aiheista, jotka voi käsitellä julkisilla keskustelukanavilla.

3 § Kanavalle #suippumadonlakin-tunnistaminen lähetetyt tunnistuskuvat saavat sisältää ainoastaan poimimattomia sieniä. Aloittelijoiden ei kannata keskittyä muiden psilosybiinipitoisten lajien tunnistamiseen ja niitä koskevat tunnistustehtävät tulee ohjata foorumille asiaankuuluviin viestiketjuihin.

4 § Kaikenlainen kaupankäynti ja lahjoitukset käyttäjien välillä on kielletty chatissa, KOSKEE MYÖS ITIÖLASKEUMIA! Itiöprinttien hankintaan liittyvät viestit on ohjattava foorumille osoitteessa <https://psilosybiini.info/keskustelu>

5 § Päihdekeskusteluissa haittoja lisäävät ja vastuuttomat (mm. laittomien päihteiden valmistukseen ja hankintaan liittyvät) kommentit ovat ehdottomasti kielletty. Älä julkaise todistusaineistoa, jota voidaan käyttää itseäsi vastaan!

HUOM: vaikka päihdekeskustelut ovat sallittuja, niitä voidaan ohjata ja rajoittaa ylläpidon toimesta yleisempään suuntaan.

6 § Mainostaminen ja kaikenlainen spämmääminen on kiellettyä. Mainostaminen voidaan kuitenkin erikseen sallia ylläpidon luvalla.

7 § Ylläpito puuttuu sääntöjen vastaisiin viesteihin ja tarvittaessa erottaa käyttäjän ryhmästä.

8 § Jotta pääset käsiksi muihin kanaviin, vastaa oletko !ihminen, !robotti vai !mamelukki? Vastaa tälle kanavalle, äläkä unohda huutomerkkiä komennon alusta!

9 § Ryhmässä noudatetaan Discordin palveluehtoja ja toimintaohjeita:
<https://discordapp.com/terms>
<https://discordapp.com/guidelines>

10 § Ylläpito pidättää oikeuden sääntöjen välittömiin muutoksiin ja käyttää toimivaltaansa tarvittaessa myös harkinnan mukaan tilannekohtaisesti

Katso myös kanavakohtaiset Kiinnitetyt (pinned) viestit, sekä #säännöt-ja-ohjeet -kanava.
  `);

  const newProfile = {
    guildID: member.guild.id,
    guildName: member.guild.name,
    userID: member.id,
    username: member.user.tag,
  };

  try {
    await client.createProfile(newProfile);
  } catch (err) {
    console.error(err);
  }
};
