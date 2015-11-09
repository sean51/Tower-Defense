#pragma strict

private var timer : float = 0.0;
public var coolDown : float = 5.0f;
private var onCooldown : boolean = true;
private var homeTower : GameObject;
public var demonFlame : GameObject;

function Start () 
{

}

function Update () 
{
	if(onCooldown)
	{
		timer += Time.deltaTime;
		{
			if(timer > coolDown)
			{
				onCooldown = false;
				timer = 0.0;
			}
		}
	}
	else
	{
		attack();
	}
}

function attack()
{
	var fireVictims = Physics.OverlapSphere(transform.position, 1);
	var fired : boolean = false;
	var direction : Vector3;
	for (var l = 0; l < fireVictims.Length; l++) 
	{
		if(fireVictims[l].gameObject.tag == "Enemy")
		{
			if(!fired)
			{
				fired = true;
				direction = fireVictims[l].gameObject.transform.position;
			}
			var dmgPacket : List.<Object> = new List.<Object>();
			dmgPacket.Add(22);
			dmgPacket.Add(homeTower);
			fireVictims[l].gameObject.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
			if (homeTower != null)
			{
				fireVictims[l].gameObject.GetComponent(Destructable).SendMessage("Set_Burn", homeTower);
			}
			else
			{
				fireVictims[l].gameObject.GetComponent(Destructable).SendMessage("Set_Burn_Test");
			}
		}
	}
	if(fired)
	{
		gameObject.transform.LookAt(direction);
		var particleEffect : GameObject = Instantiate (demonFlame, transform.position, transform.rotation);
	}
	onCooldown = true;
}

function linkTower(myTower : GameObject)
{
	homeTower = myTower;
}