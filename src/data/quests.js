/* eslint max-len:0 */
'use strict';

var quests = {
  'objectives': {
    'monsterhunt': {
      'title': 'Slay a Monster',
      'reward': ['gold', 'item'],
      'intro': [
        'Your knight\'s quest is almost reaching its end as they approach the monster\'s lair'
      ],
      'choices': [
        {
          'title': 'Slay the monster !',
          'completionSuccess': [
            'Your knights fight bravely and after a while, {k$1$nickName} is finally able to give a fatal blow.'
          ],
          'completionFailure': [
            '{k$2$name} is almost instantly hacked to pieces by the monster. {k$1$name} carry {k$2$them} away. {k$2$they$cap} is gravely wounded and {k$1$name} has to tend to {k$2$them}'
          ],
          'test': 30,
          'traits': {
            'brave': 20,
            'coward': -10
          },
          'items': {
            'lightfeetboot': 20,
            'horses': -10
          }
        }
      ]
    },
    'graal': {
      'id': 'graal',
      'title': 'Search for the Graal',
      'reward': ['graalsearch'],
      'intro': [
        'Your knights search for the Graal'
      ],
      'choices': [
        {
          'title': 'Is it around ?',
          'completionSuccess': [
            'YES HERE IT IS'
          ],
          'completionFailure': [
            'No, but we have some good leads.'
          ],
          'test': 'findGraal',
          'traits': {
          },
          'items': {
          }
        }
      ]
    }/*,
    {
      'title': 'Hire a Knight',
      'reward': ['hireknight']
    },
    {
      'title': 'Defeat an evil Knight',
      'reward': ['gold', 'item']
    },
    {
      'title': 'Save a Princess',
      'reward': ['item']
    },
    {
      'title': 'Free a village',
      'reward': ['gold', 'item']
    },
    {
      'title': 'Fend of a Barbarian Invasion',
      'reward': ['gold']
    }*/
  },
  'adventures': [
    {
      'title': 'Cross a suspended bridge',
      'intro': [
        'After a long way through a dense forest, your knights approach a deep ravine. {k$1$name} spots an old suspended bridge. It seems shaky and unsafe, but it is the only way accross'
      ],
      'choices': [
        {
          'title': 'Try to send the knights on the bridge one by one',
          'completionSuccess': [
            'Everybody makes it safely accross the bridge. It was more frightening than it ought to be'
          ],
          'completionFailure': [
            '{k$2$name} suddenly discovers that {k$2$they} has a paralysing fear of heights. The party has no choice but to go back.',
            '{k$1$name} accidentally slips on a wet plank an falls in the gorge, barely catching {k$1$themselves} to a branch. {k$1$their$cap} leg is broken and the knights have to retreat.'
          ],
          'test': 30,
          'traits': {
            'brave': 20,
            'coward': -10
          },
          'items': {
            'lightfeetboot': 20,
            'horses': -10
          }
        },
        {
          'title': 'Have the knights go in all at once',
          'completionSuccess': [
            'Everybody makes it safely accross the bridge. It did creak quite a lot, but held strong.'
          ],
          'completionFailure': [
            '{k$1$name} accidentally slips on a wet plank an falls in the gorge. {k$2$name} makes a desperate move to catch {k$1$them} but fails. {k$1$their$cap} leg is broken and the knights have to retreat.',
            'Right in the middle of the crossing, the bridge snaps. The knights are thrown down the ravine and plumet towards the river below. They plunge deep in the torrent, and are carried way of their path, having no choice but to retreat back to Caamelot.'
          ],
          'test': 30,
          'traits': {
            'brave': 20
          },
          'items': {
            'lightfeetboot': 20,
            'horses': -10
          }
        }
      ]
    },
    {
      'title': 'Question an old man for clues',
      'intro': [
        'Your knights arrive at a small village soon after the sunset. {k$1$name} suggests they ask around if the villagers have any clues to help them on their quest. In the village Inn, they meet an old man, who might have some information. But he keeps on telling stories about his past.',
        'Before noon, the knights meet an old man by the side of the road. After he greets them, he says he has some information that might interest the knights but he babbles like a fool.'
      ],
      'choices': [
        {
          'title': 'Try to give the old man a good shake.',
          'completionSuccess': [
            'The old man sobers up and gets to the point.'
          ],
          'completionFailure': [
            '{k$2$name} shakes the old man, he has a heart attack and dies on the spot. No clues will come from this one',
            '{k$1$name} shakes the old man, but to no avail, he is even more useless after that'
          ],
          'test': 30,
          'traits': {
            'brave': 20,
            'coward': -10
          },
          'items': {
            'lightfeetboot': 20,
            'horses': -10
          }
        },
        {
          'title': 'Bribe the old man with food and mead.',
          'completionSuccess': [
            'The old man finally gives the information the knights require.'
          ],
          'completionFailure': [
            '{k$1$name} gives the old man plenty of food and some drinks. When the old man finishes his meal, he falls asleep, and the knights are unable to wake him up',
            '{k$2$name} gives his man some old clams {k$2$they} had in {k$2$their} bag. The clams weren\'t that fresh, The old man is horribly poisoned and dies before the helpless knights.'
          ],
          'test': 30,
          'traits': {
            'brave': 20
          },
          'items': {
            'lightfeetboot': 20,
            'horses': -10
          }
        }
      ]
    }/*,
    {
      'title': 'Answer a riddle',
      'test': 50,
      'traits': {
        'smart': 30,
        'stupid': -10
      },
      'items': {
        'thoughtsstone': 20
      }
    },
    {
      'title': 'Find your way out of a maze',
      'test': 50,
      'traits': {

      },
      'items': {

      }
    },
    {
      'title': 'Defend yourself from an ambush',
      'test': 'combat',
      'traits': {

      },
      'items': {

      }
    }*/
  ]
};

module.exports = quests;
